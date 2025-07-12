<template>
    <div class="map-container">
        <div id="map" ref="mapContainer"></div>
        <div class="image-transition-overlay" :class="{ 'fade-out': isTransitioning, 'hidden': !isTransitioning }">
        </div>
        <div v-if="showGallery" class="gallery-modal" @click.self="closeGallery">
            <div class="gallery-content">
                <button class="close-button" @click="closeGallery">&times;</button>
                <div class="gallery-images">
                    <img v-for="(image, index) in galleryImages" :key="index" :src="this.getURL(image.src,'S')" :alt="image.alt"
                        @click="showFullImage(image)">
                </div>
                <div v-if="fullScreenImage" class="full-screen-image" @click="closeFullImage">
                    <img :src="this.getURL(fullScreenImage.src,'X5')" :alt="fullScreenImage.alt">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import L from 'leaflet';

// Fix for the missing marker icon issue in Leaflet with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// No icon imports since we're using default icons temporarily


let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Define custom icons for different POI types
const customIcons = {
    'well': L.icon({ iconUrl: "/icons/rain-water-harvesting.png", shadowUrl: iconShadow, iconSize: [48, 48], iconAnchor: [12, 41], popupAnchor: [0, -41] }),
    'sewage': L.icon({ iconUrl: "/icons/tee.png", shadowUrl: iconShadow, iconSize: [36, 36], iconAnchor: [12, 36], popupAnchor: [0, -36] }),
    'water': L.icon({ iconUrl: "/icons/tap.png", shadowUrl: iconShadow, iconSize: [36, 36], iconAnchor: [12, 36], popupAnchor: [0, -36] }),
    'electric': L.icon({ iconUrl: "/icons/wire.png", shadowUrl: iconShadow, iconSize: [36, 36], iconAnchor: [12, 36], popupAnchor: [0, -36] }),
    'telcom': L.icon({ iconUrl: "/icons/lan.png", shadowUrl: iconShadow, iconSize: [36, 36], iconAnchor: [12, 36], popupAnchor: [0, -36] }),
    'gallery': L.icon({ iconUrl: "/icons/camera.png", shadowUrl: iconShadow, iconSize: [42, 42], iconAnchor: [12, 42], popupAnchor: [0, -42] }),
};

L.Marker.prototype.options.icon = DefaultIcon;

export default {
    name: 'LeafletMap',
    props: {
        showFloorPlant: {
            type: Boolean,
            default: false
        },
        hidePOI: {
            type: Boolean,
            default: false
        },
        imageUrl: {
            type: String,
            default: '/images/DJI_0784.jpg'
        },
        showGalery: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            map: null,
            markers: [],
            polylines: [], // Add array to store polylines
            imageOverlay: null,
            isTransitioning: false,
            previousImageUrl: null,
            showPOI: true,
            showGaleryPOI: false,
            markerRefs: {}, // Add object to store references to specific markers
            showGallery: false,
            galleryImages: [],
            fullScreenImage: null,
            galleryTitle: ''
        };
    },
    watch: {
        imageUrl(newImageUrl) {
            // When imageUrl changes, reload the map with the new image
            if (newImageUrl !== this.previousImageUrl) {
                this.previousImageUrl = this.imageUrl;
                this.startTransition();
                setTimeout(() => {
                    this.clearMap();
                    console.log('Image URL changed:', newImageUrl);
                    this.loadImageAndInitMap();
                }, 300); // Wait for fade-out animation to complete
            }
        },
        showFloorPlant(newValue) {
            // If showFloorPlant changes, reload the map with the new image
            if (newValue) {
                this.startTransition();
                this.loadImageAndInitMap();
            } else {
                this.startTransition();
                this.loadImageAndInitMap();
            }
        },
        hidePOI(newValue) {
            // If hidePOI changes, reload the map with the new image
            this.showPOI = !newValue; // Toggle visibility based on hidePOI
            if (newValue) {
                this.startTransition();
                this.clearMap();
                this.loadImageAndInitMap();
            } else {
                this.startTransition();
                this.clearMap();
                this.loadImageAndInitMap();
            }
        },
        showGalery(newValue) {
            // If showGalery changes, reload the map with the new image
            this.showGaleryPOI = !newValue; // Toggle visibility based on showGalery
            if (newValue) {
                this.startTransition();
                this.clearMap();
                this.loadImageAndInitMap();
            } else {
                this.startTransition();
                this.clearMap();
                this.loadImageAndInitMap();
            }
        }

    },
    mounted() {
        this.loadImageAndInitMap();
    },
    methods: {
        startTransition() {
            this.isTransitioning = true;
        },

        endTransition() {
            this.isTransitioning = false;
        },

        clearMap() {
            // Clear existing markers
            if (this.markers.length) {
                this.markers.forEach(marker => {
                    if (this.map) marker.remove();
                });
                this.markers = [];
            }

            // Clear existing polylines
            if (this.polylines.length) {
                this.polylines.forEach(polyline => {
                    if (this.map) polyline.remove();
                });
                this.polylines = [];
            }

            // Remove image overlay
            if (this.imageOverlay && this.map) {
                this.imageOverlay.remove();
                this.imageOverlay = null;
            }
        },

        loadImageAndInitMap() {
            // Load the image first to get its dimensions
            const img = new Image();
            img.onload = () => {
                const imgWidth = img.width;
                const imgHeight = img.height;

                // If map doesn't exist, initialize it. Otherwise, just update the image overlay
                if (!this.map) {
                    this.initMap(imgWidth, imgHeight);
                } else {
                    this.updateImageOverlay(imgWidth, imgHeight);
                }
            };
            img.src = this.imageUrl;
        },

        updateImageOverlay(imgWidth, imgHeight) {
            // Calculate bounds based on the actual image dimensions
            const bounds = [[0, 0], [imgHeight, imgWidth]];

            // Add the new image overlay with opacity 0
            const newImageOverlay = L.imageOverlay(this.imageUrl, bounds, {
                opacity: 0, // Start with transparent overlay
                className: 'fadeable-image'
            }).addTo(this.map);

            // Center the map on the new image bounds without changing zoom level
            const center = [imgHeight / 2, imgWidth / 2];
            this.map.setView(center, this.map.getZoom(), {
                animate: false
            });

            // Update max bounds
            const paddingFactor = 0.2;
            const paddedBounds = [
                [-imgHeight * paddingFactor, -imgWidth * paddingFactor],
                [imgHeight * (1 + paddingFactor), imgWidth * (1 + paddingFactor)]
            ];
            this.map.setMaxBounds(paddedBounds);

            if (this.showFloorPlant) {
                // Fade out the old overlay
                L.imageOverlay('/images/20240101.jpg', bounds, { opacity: 0.5 }).addTo(this.map);
            }

            // Assign the new overlay and fade it in
            this.imageOverlay = newImageOverlay;
            // Add markers for the new image
            this.addMarkers(imgWidth, imgHeight);

            // After a short delay to ensure the DOM has updated, fade in the new overlay
            setTimeout(() => {
                if (this.imageOverlay) {
                    this.imageOverlay.setOpacity(1);
                    setTimeout(() => {
                        this.endTransition();
                    }, 300); // Match this with CSS transition duration
                }
            }, 50);
        },

        initMap(imgWidth, imgHeight) {
            // Create a map without any base layer
            this.map = L.map(this.$refs.mapContainer, {
                crs: L.CRS.Simple,
                minZoom: -5, // Allow more zoom out to see the entire image
                maxZoom: 5,  // Allow more zoom in for details
                zoomSnap: 0.1, // Allow finer zoom levels
                zoomDelta: 0.5,
                wheelPxPerZoomLevel: 120,
                attributionControl: false, // Remove attribution control to save space
                zoomControl: false // Move zoom control to a better position later
            });

            // Add zoom control to bottom right
            L.control.zoom({
                position: 'bottomright'
            }).addTo(this.map);

            // Update image overlay and markers
            this.updateImageOverlay(imgWidth, imgHeight);

            // After creating the overlay, fit the map to the bounds on initial load
            if (this.imageOverlay) {
                const bounds = this.imageOverlay.getBounds();
                this.map.fitBounds(bounds, {
                    padding: [0, 0],
                    maxZoom: 0,
                    animate: false
                });
            }

            // Add resize event listener to ensure map fills container when window is resized
            window.addEventListener('resize', this.onResize);
        },

        onResize() {
            // Force map to re-evaluate size and maintain full viewport
            if (this.map) {
                this.map.invalidateSize();

                // Recalculate image fitting if needed
                if (this.imageOverlay) {
                    const bounds = this.imageOverlay.getBounds();
                    this.map.fitBounds(bounds, {
                        padding: [0, 0],
                        maxZoom: 0
                    });
                }
            }
        },

        addMarkers(imgWidth, imgHeight) {
            // Example POIs - with coordinates relative to image dimensions
            const pois = [
                { name: 'Poço', icon: 'well', location: [imgHeight * 0.915, imgWidth * 0.08], description: 'Poço do GeoDrenos', date: '20240510' },
                // Caixa Visita de Esgotos
                { name: 'CV0', icon: 'sewage', location: [imgHeight * 0.790, imgWidth * 0.020], description: 'Caixa de Visita do Esgoto 0', date: '20241116' },
                { name: 'CV1', icon: 'sewage', location: [imgHeight * 0.720, imgWidth * 0.145], description: 'Caixa de Visita do Esgoto 1', date: '20241116' },
                { name: 'CV2', icon: 'sewage', location: [imgHeight * 0.445, imgWidth * 0.145], description: 'Caixa de Visita do Esgoto 2', date: '20241116' },
                { name: 'CV3', icon: 'sewage', location: [imgHeight * 0.178, imgWidth * 0.140], description: 'Caixa de Visita do Esgoto 3', date: '20241116' },
                { name: 'CV4', icon: 'sewage', location: [imgHeight * 0.105, imgWidth * 0.422], description: 'Caixa de Visita do Esgoto 4', date: '20241116' },
                { name: 'CV5', icon: 'sewage', location: [imgHeight * 0.105, imgWidth * 0.715], description: 'Caixa de Visita do Esgoto 5', date: '20241116' },
                { name: 'CV6', icon: 'sewage', location: [imgHeight * 0.785, imgWidth * 0.755], description: 'Caixa de Visita do Esgoto 6', date: '20241205' },
                { name: 'CV7', icon: 'sewage', location: [imgHeight * 0.785, imgWidth * 0.630], description: 'Caixa de Visita do Esgoto 7', date: '20241205' },
                { name: 'CV8', icon: 'sewage', location: [imgHeight * 0.785, imgWidth * 0.460], description: 'Caixa de Visita do Esgoto 8', date: '20241205' },
                { name: 'CV9', icon: 'sewage', location: [imgHeight * 0.785, imgWidth * 0.274], description: 'Caixa de Visita do Esgoto 9', date: '20241205' },
                // Water point
                { name: 'PA0', icon: 'water', location: [imgHeight * 0.960, imgWidth * 0.215], description: 'Torneira', date: '20250201' },
                { name: 'PA1', icon: 'water', location: [imgHeight * 0.745, imgWidth * 0.935], description: 'Torneira', date: '20250201' },
                { name: 'PA2', icon: 'water', location: [imgHeight * 0.050, imgWidth * 0.835], description: 'Torneira', date: '20250201' },
                { name: 'PA3', icon: 'water', location: [imgHeight * 0.050, imgWidth * 0.660], description: 'Torneira', date: '20250201' },
                { name: 'PA4', icon: 'water', location: [imgHeight * 0.050, imgWidth * 0.690], description: 'Chuveiro', date: '20250201' },

                // Electrical substation
                { name: 'Electricidade', icon: 'electric', location: [imgHeight * 0.62, imgWidth * 0.180], description: 'Subestação Elétrica', date: '20241120' },
                { name: 'Telecomunicacoes', icon: 'telcom', location: [imgHeight * 0.62, imgWidth * 0.199], description: 'Subestação Elétrica', date: '20241110' },

                // Gallery marker
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.50, imgWidth * 0.5], description: 'Fotos', date: '20240515', isGallery: true, galleryId: 'before' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.85, imgWidth * 0.1], description: 'Fotos', date: '20240515', isGallery: true, galleryId: 'geodrenos' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.65, imgWidth * 0.8], description: 'Fotos', date: '20240515', isGallery: true, galleryId: 'lake' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.60, imgWidth * 0.1], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'construction' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.30, imgWidth * 0.1], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'olivetree' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.50, imgWidth * 0.5], description: 'Fotos', date: '20240611', isGallery: true, galleryId: 'lage' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.50, imgWidth * 0.5], description: 'Fotos', date: '20240729', isGallery: true, galleryId: 'struture-building' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.4], description: 'Fotos', date: '20240729', isGallery: true, galleryId: 'struture-placagem' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.4], description: 'Fotos', date: '20240910', isGallery: true, galleryId: 'struture-interior' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.25, imgWidth * 0.95], description: 'Fotos', date: '20240927', isGallery: true, galleryId: 'chinese-case' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.10, imgWidth * 0.45], description: 'Fotos', date: '20240927', isGallery: true, galleryId: 'night-view' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.35, imgWidth * 0.28], description: 'Fotos', date: '20240927', isGallery: true, galleryId: 'internal-view01' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.74, imgWidth * 0.30], description: 'Fotos', date: '20240927', isGallery: true, galleryId: 'internal-view02' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.24, imgWidth * 0.60], description: 'Fotos', date: '20240919', isGallery: true, galleryId: 'pool-prep' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.20], description: 'Fotos', date: '20241012', isGallery: true, galleryId: 'roofInspect' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.74, imgWidth * 0.30], description: 'Fotos', date: '20241012', isGallery: true, galleryId: 'water-damage01' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.74, imgWidth * 0.40], description: 'Fotos', date: '20241012', isGallery: true, galleryId: 'water-damage02' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.65], description: 'Fotos', date: '20241117', isGallery: true, galleryId: 'sideView' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.20, imgWidth * 0.40], description: 'Fotos', date: '20241117', isGallery: true, galleryId: 'sideView02' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.30, imgWidth * 0.30], description: 'Fotos', date: '20241117', isGallery: true, galleryId: 'interior01' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.70], description: 'Fotos', date: '20241122', isGallery: true, galleryId: 'exterior02' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.55, imgWidth * 0.30], description: 'Fotos', date: '20241206', isGallery: true, galleryId: 'interior03' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.35, imgWidth * 0.60], description: 'Fotos', date: '20241206', isGallery: true, galleryId: 'exterior03' },

                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.55, imgWidth * 0.30], description: 'Fotos', date: '20250210', isGallery: true, galleryId: 'interior04' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.35, imgWidth * 0.60], description: 'Fotos', date: '20250210', isGallery: true, galleryId: 'exterior04' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.80, imgWidth * 0.30], description: 'Fotos', date: '20250504', isGallery: true, galleryId: 'exterior05' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.50, imgWidth * 0.45], description: 'Fotos', date: '20250504', isGallery: true, galleryId: 'interior05' },


                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.75], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'exterior06' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.30], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'interior06' },


                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.75], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'exterior07' },
                { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.30], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'interior07' },
            ];

            // Extract the date from the image filename
            const dateMatch = this.imageUrl.match(/\/images\/(\d{8})\.jpg/);
            const imageDate = dateMatch ? dateMatch[1] : 'unknown';
            // Parse the imageDate as a Date object
            const parsedDate = imageDate !== 'unknown' ? new Date(
                imageDate.substring(0, 4), // Year
                parseInt(imageDate.substring(4, 6)) - 1, // Month (0-based)
                imageDate.substring(6, 8), 0, 0, 0, 0 // Day,
            ) : null;

            // Reset markerRefs for the new image
            this.markerRefs = {};

            // If POIs are hidden, do not add any markers
            // Add markers to the map with custom icons based on name
            pois.forEach(poi => {

                if (this.showGaleryPOI && poi.isGallery) return; // Skip if gallery POIs are hidden
                if (this.hidePOI && !poi.isGallery) return; // Skip if POIs are hidden and not a gallery marker

                const poiDate = poi.date !== 'unknown' ? new Date(
                    poi.date.substring(0, 4), // Year
                    parseInt(poi.date.substring(4, 6)) - 1, // Month (0-based)
                    poi.date.substring(6, 8), 0, 0, 0, 0 // Day,
                ) : null;
                // Only show gallery markers if the date matches
                if (poi.isGallery && poiDate.toDateString() != parsedDate.toDateString()) {
                    return;
                }
                // Only show POIs if the date matches (or is after the image date)
                if (!poi.isGallery && poiDate > parsedDate) return;


                const markerIcon = customIcons[poi.icon] || DefaultIcon;
                const marker = L.marker(poi.location, { icon: markerIcon }).addTo(this.map);

                if (poi.isGallery) {
                    marker.on('click', () => {
                        this.openGallery(poi.galleryId, poi.name);
                    });
                    marker.bindPopup(`<b>${poi.name}</b><br>${poi.description}<br><i>Clique para ver a galeria</i>`);
                } else {
                    marker.bindPopup(`<b>${poi.name}</b><br>${poi.description}`);
                }

                this.markers.push(marker);

                if (['CV0', 'CV1', 'CV2', 'CV3', 'CV4', 'CV5', 'CV6', 'CV7', 'CV8', 'CV9'].includes(poi.name)) {
                    this.markerRefs[poi.name] = {
                        marker: marker,
                        location: poi.location,
                        visible: true
                    };
                }
            });
            // Common polyline options for sewage lines
            this.addSewageLines();
        },
        getURL(image,size) {
            return `https://photos.smugmug.com/photos/${image}/0/MX8rJZ7VmWTrCcW5QLgPbzPnnqCv7xB7rQ4qZjpwX/${size}/${image}.jpg`;
        },
        openGallery(galleryId, title) {
            this.galleryTitle = title || 'Galeria de Fotos';

            // Set images based on gallery ID
            switch (galleryId) {
                case 'before':
                    this.galleryImages = [
                        { src: 'i-4Wwt4bC', alt: 'Frente do Pateo' },
                        { src: 'i-FcHM4dP', alt: 'Frente do Pateo' },

                    ];
                    break;
                case 'construction':
                    this.galleryImages = [
                        { src: 'i-3hp6W9Z', alt: 'Frente do Pateo' },
                        { src: 'i-BS2RTpR', alt: 'Frente do Pateo' },
                        { src: 'i-3Z49bQD', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'olivetree':
                    this.galleryImages = [
                        { src: 'i-z3XcsC5', alt: 'Frente do Pateo' },
                        { src: 'i-6XWqLzw', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'geodrenos':
                    this.galleryImages = [
                        { src: 'i-Q7r5GLf', alt: 'Frente do Pateo' },
                        { src: 'i-9njWhfV', alt: 'Frente do Pateo' },
                        { src: 'i-nXqvkmC', alt: 'Frente do Pateo' },


                    ];
                    break;
                case 'lake':
                    this.galleryImages = [
                        { src: 'i-gzJzvDs', alt: 'Frente do Pateo' },
                        { src: 'i-xNHM5hq', alt: 'Frente do Pateo' },
                        { src: 'i-hC5KVB7', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'lage':
                    this.galleryImages = [
                        { src: 'i-jPNj3jJ', alt: 'Frente do Pateo' },
                    ];
                    break;

                case 'struture-building':
                    this.galleryImages = [
                        { src: 'i-9tF6KKF', alt: 'Frente do Pateo' },
                        { src: 'i-SjSMhJd', alt: 'Frente do Pateo' },
                        { src: 'i-Gd465vD', alt: 'Frente do Pateo' },
                        { src: 'i-r2Zx4Dr', alt: 'Frente do Pateo' },
                        { src: 'i-3jXtt6j', alt: 'Frente do Pateo' },
                        { src: 'i-JRJGNBQ', alt: 'Frente do Pateo' },
                        { src: 'i-DrWSN8N', alt: 'Frente do Pateo' },
                        { src: 'i-vSHFXwC', alt: 'Frente do Pateo' },
                        { src: 'i-hxwQL2p', alt: 'Frente do Pateo' },
                        { src: 'i-RbxTWWR', alt: 'Frente do Pateo' },
                        { src: 'i-nc6zk8C', alt: 'Frente do Pateo' },
                        { src: 'i-Pz5vWM2', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'struture-placagem':
                    this.galleryImages = [
                        { src: 'i-R6VhpZP', alt: 'Frente do Pateo' },
                        { src: 'i-gDMRJKf', alt: 'Frente do Pateo' },
                        { src: 'i-jsRnWRx', alt: 'Frente do Pateo' },
                        { src: 'i-KJPJ8s3', alt: 'Frente do Pateo' },
                        { src: 'i-86P4hVV', alt: 'Frente do Pateo' },
                        { src: 'i-nTV6p53', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'struture-interior':
                    this.galleryImages = [
                        { src: 'i-gDMRJKf', alt: 'Frente do Pateo' },
                        { src: 'i-3btGT2J', alt: 'Frente do Pateo' },
                        { src: 'i-GQTJ9kc', alt: 'Frente do Pateo' },
                        { src: 'i-6npGNmW', alt: 'Frente do Pateo' },
                        { src: 'i-C2hpQ22', alt: 'Frente do Pateo' },
                        { src: 'i-qtBN7Th', alt: 'Frente do Pateo' },
                        { src: 'i-xZsHz3H', alt: 'Frente do Pateo' },
                        { src: 'i-kpZhqFK', alt: 'Frente do Pateo' },
                        { src: 'i-Nx97FRX', alt: 'Frente do Pateo' },
                        { src: 'i-n5c4Cwt', alt: 'Frente do Pateo' },
                        { src: 'i-ZvCTDFx', alt: 'Frente do Pateo' },
                        { src: 'i-VxqTwBp', alt: 'Frente do Pateo' },
                        { src: 'i-5CjxcDp', alt: 'Frente do Pateo' },
                    ];
                    break; //
                case 'pool-hole':
                    this.galleryImages = [
                        { src: 'i-GW8k6j4', alt: 'Frente do Pateo' },
                        { src: 'i-FD5nKFr', alt: 'Frente do Pateo' },
                        { src: 'i-7KJvhZK', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'chinese-case':
                    this.galleryImages = [
                        { src: 'i-XNRcdJQ', alt: 'Frente do Pateo' },
                        { src: 'i-L7RpnzM', alt: 'Frente do Pateo' },
                        { src: 'i-8HCGd6x', alt: 'Frente do Pateo' },
                        { src: 'i-v2WC5KG', alt: 'Frente do Pateo' },
                        { src: 'i-6VfXz8m', alt: 'Frente do Pateo' },
                        { src: 'i-2qcQd9K', alt: 'Frente do Pateo' },
                        { src: 'i-kJGfsbN', alt: 'Frente do Pateo' },
                        { src: 'i-jNDzdF9', alt: 'Frente do Pateo' },
                        { src: 'i-MrsWqJs', alt: 'Frente do Pateo' },
                        { src: 'i-RJrLggg', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'night-view':
                    this.galleryImages = [
                        { src: 'i-Tp6ZNr4', alt: 'Frente do Pateo' },
                        { src: 'i-9SbvNPQ', alt: 'Frente do Pateo' },
                        { src: 'i-NXhVm3W', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'internal-view01':
                    this.galleryImages = [
                        { src: 'i-rvGKhHK', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'internal-view02':
                    this.galleryImages = [
                        { src: 'i-RrftZLV', alt: 'Frente do Pateo' },
                        { src: 'i-VBK9dnL', alt: 'Frente do Pateo' },
                        { src: 'i-DNF7kvd', alt: 'Frente do Pateo' },
                        { src: 'i-rKDSggh', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'water-damage01':
                    this.galleryImages = [
                        { src: 'i-D7s86NJ', alt: 'Frente do Pateo' },
                        { src: 'i-2mtMBKG', alt: 'Frente do Pateo' },
                        { src: 'i-dMTpsnH', alt: 'Frente do Pateo' },
                        { src: 'i-bWnpxBs', alt: 'Frente do Pateo' },
                        { src: 'i-nJ4KvnC', alt: 'Frente do Pateo' },
                        { src: 'i-NqGw3Tz', alt: 'Frente do Pateo' }
                    ];
                    break;
                case 'water-damage02':
                    this.galleryImages = [
                        { src: 'i-n4DDBM2', alt: 'Frente do Pateo' },
                        { src: 'i-dn3bMGR', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'pool-prep':
                    this.galleryImages = [
                        { src: 'i-GW8k6j4', alt: 'Frente do Pateo' },
                        { src: 'i-gzjftVG', alt: 'Frente do Pateo' },
                        { src: 'i-7KJvhZK', alt: 'Frente do Pateo' },
                        { src: 'i-rzt8Lg9', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'roofInspect':
                    this.galleryImages = [
                        { src: 'i-bLtgB95', alt: 'Frente do Pateo' },
                        { src: 'i-RcPKptq', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'sideView':
                    this.galleryImages = [
                        { src: 'i-rwPwWDs', alt: 'Frente do Pateo' },
                        { src: 'i-2sstJ4d', alt: 'Frente do Pateo' },

                    ];
                    break;
                case 'sideView02':
                    this.galleryImages = [
                        { src: 'i-FrFwx8K', alt: 'Frente do Pateo' },
                        { src: 'i-WsSDkLm', alt: 'Frente do Pateo' },
                        { src: 'i-DNF7kvd', alt: 'Frente do Pateo' },
                        { src: 'i-rKDSggh', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'interior01':
                    this.galleryImages = [
                        { src: 'i-rvGKhHK', alt: 'Frente do Pateo' },
                        { src: 'i-RrftZLV', alt: 'Frente do Pateo' },
                        { src: 'i-VBK9dnL', alt: 'Frente do Pateo' },
                        { src: 'i-bcHHcWH', alt: 'Frente do Pateo' },
                        { src: 'i-dmzrdnP', alt: 'Frente do Pateo' },
                        { src: 'i-xdJtc6b', alt: 'Frente do Pateo' },
                        { src: 'i-5dk27sx', alt: 'Frente do Pateo' },
                        { src: 'i-fzNKs5S', alt: 'Frente do Pateo' },
                        { src: 'i-QXJNMpV', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'interior02':
                    this.galleryImages = [
                        { src: 'i-pPNWGPB', alt: 'Frente do Pateo' },
                        { src: 'i-NqxDmZW', alt: 'Frente do Pateo' },
                        { src: 'i-8z5tZmh', alt: 'Frente do Pateo' },
                        { src: 'i-HVbnfcR', alt: 'Frente do Pateo' },
                        { src: 'i-mt5WvKq', alt: 'Frente do Pateo' },
                        { src: 'i-m8dL9Pt', alt: 'Frente do Pateo' },
                        { src: 'i-WVtM7mG', alt: 'Frente do Pateo' },
                        { src: 'i-Lxw8x6v', alt: 'Frente do Pateo' },
                        { src: 'i-n8gsJ72', alt: 'Frente do Pateo' },
                        { src: 'i-sQVGfQD', alt: 'Frente do Pateo' },
                        { src: 'i-LwwkrW3', alt: 'Frente do Pateo' },
                        { src: 'i-qLq5QkX', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'exterior02':
                    this.galleryImages = [
                        { src: 'i-pDGQwB4', alt: 'Frente do Pateo' },
                        { src: 'i-s7N7LjQ', alt: 'Frente do Pateo' },
                        { src: 'i-r2rjbt5', alt: 'Frente do Pateo' },
                        { src: 'i-cfMkhXn', alt: 'Frente do Pateo' },
                        { src: 'i-FNCzWd8', alt: 'Frente do Pateo' },
                        { src: 'i-6QfJhX9', alt: 'Frente do Pateo' },
                        { src: 'i-964z32f', alt: 'Frente do Pateo' },
                        { src: 'i-zmdT9sw', alt: 'Frente do Pateo' },
                        { src: 'i-P7kB7Q2', alt: 'Frente do Pateo' },
                        { src: 'i-MtddJLx', alt: 'Frente do Pateo' },
                        { src: 'i-457D8Vc', alt: 'Frente do Pateo' },
                        { src: 'i-tmZ7sbx', alt: 'Frente do Pateo' },
                        { src: 'i-sJ58gmg', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'interior03':
                    this.galleryImages = [
                        { src: 'i-8PjSh2b', alt: 'Frente do Pateo' },
                        { src: 'i-qXTtJJB', alt: 'Frente do Pateo' },
                        { src: 'i-3dSkwcV', alt: 'Frente do Pateo' },
                        { src: 'i-L8zJCmd', alt: 'Frente do Pateo' },
                        { src: 'i-7CvCpZf', alt: 'Frente do Pateo' },
                        { src: 'i-LLQ8xc3', alt: 'Frente do Pateo' },
                        { src: 'i-Nk9vqcq', alt: 'Frente do Pateo' },
                        { src: 'i-Wzwrk3q', alt: 'Frente do Pateo' },
                        { src: 'i-mdJKJqS', alt: 'Frente do Pateo' },
                        { src: 'i-5Zzgf7q', alt: 'Frente do Pateo' }];
                    break;
                case 'exterior03':
                    this.galleryImages = [
                        { src: 'i-4DXPdnF', alt: 'Frente do Pateo' },
                        { src: 'i-RVqRpVx', alt: 'Frente do Pateo' },
                        { src: 'i-Zn9mNR3', alt: 'Frente do Pateo' },
                        { src: 'i-JM2Sdq2', alt: 'Frente do Pateo' },
                        { src: 'i-gSMJz4m', alt: 'Frente do Pateo' },
                        { src: 'i-ChxFnHC', alt: 'Frente do Pateo' },
                        { src: 'i-NJhdGcq', alt: 'Frente do Pateo' },
                        { src: 'i-Zx8TCZp', alt: 'Frente do Pateo' }];
                    break;
                case 'exterior04':
                    this.galleryImages = [
                        { src: 'i-wvcfG2D', alt: 'Frente do Pateo' },
                        { src: 'i-Nh43GdW', alt: 'Frente do Pateo' },
                        { src: 'i-q9Rsfkv', alt: 'Frente do Pateo' },
                        { src: 'i-qvFmX8v', alt: 'Frente do Pateo' },
                        { src: 'i-nqKshzm', alt: 'Frente do Pateo' },
                        { src: 'i-9742mBR', alt: 'Frente do Pateo' },
                        { src: 'i-6BvG7SB', alt: 'Frente do Pateo' }];
                    break;
                case 'interior04':
                    this.galleryImages = [
                        { src: 'i-DhxgWHB', alt: 'Frente do Pateo' },
                        { src: 'i-zZ5WgVN', alt: 'Frente do Pateo' },
                        { src: 'i-WQWPPjX', alt: 'Frente do Pateo' },
                        { src: 'i-3XfR828', alt: 'Frente do Pateo' },
                        { src: 'i-z7xsvht', alt: 'Frente do Pateo' },
                        { src: 'i-MTprt73', alt: 'Frente do Pateo' },
                        { src: 'i-c7JJLSZ', alt: 'Frente do Pateo' },
                        { src: 'i-hj2PbZj', alt: 'Frente do Pateo' },
                        { src: 'i-d2JCc6Z', alt: 'Frente do Pateo' },
                        { src: 'i-GpkxvbF', alt: 'Frente do Pateo' },
                        { src: 'i-hj2PbZj', alt: 'Frente do Pateo' }];
                    break;
                case 'exterior05':
                    this.galleryImages = [
                        { src: 'i-K788dw5', alt: 'Frente do Pateo' },
                        { src: 'i-tFdC4WM', alt: 'Frente do Pateo' },
                        { src: 'i-2gp8pW3', alt: 'Frente do Pateo' },
                        { src: 'i-mbfv588', alt: 'Frente do Pateo' },
                        { src: 'i-mgSF53d', alt: 'Frente do Pateo' }
                    ];
                    break;
                case 'interior05':
                    this.galleryImages = [
                        { src: 'i-qWnQwjL', alt: 'Frente do Pateo' },
                        { src: 'i-fmts2qZ', alt: 'Frente do Pateo' },
                        { src: 'i-XKpwN6D', alt: 'Frente do Pateo' },
                        { src: 'i-W8KxXqv', alt: 'Frente do Pateo' },
                        { src: 'i-SQnhdr4', alt: 'Frente do Pateo' },
                        { src: 'i-rpf8594', alt: 'Frente do Pateo' },
                        { src: 'i-PsgTZPw', alt: 'Frente do Pateo' },
                        { src: 'i-4CKFnGj', alt: 'Frente do Pateo' },
                        { src: 'i-bWG9R3B', alt: 'Frente do Pateo' },
                        { src: 'i-Xxhkfjf', alt: 'Frente do Pateo' },
                        { src: 'i-b5MwmST', alt: 'Frente do Pateo' },
                        { src: 'i-KcT5SSv', alt: 'Frente do Pateo' },
                        { src: 'i-4gwjbnZ', alt: 'Frente do Pateo' },
                        { src: 'i-VJ7mwpv', alt: 'Frente do Pateo' },
                        { src: 'i-RgNNZtb', alt: 'Frente do Pateo' },
                        { src: 'i-xJjFzXJ', alt: 'Frente do Pateo' },
                        { src: 'i-DCh8CDR', alt: 'Frente do Pateo' },
                        { src: 'i-JdkJbxK', alt: 'Frente do Pateo' },
                        { src: 'i-sKqmjXC', alt: 'Frente do Pateo' },
                        { src: 'i-4vPpsJq', alt: 'Frente do Pateo' },
                        { src: 'i-WZJJ7Cd', alt: 'Frente do Pateo' },
                        { src: 'i-HNnJp7X', alt: 'Frente do Pateo' },
                        { src: 'i-bVZDwXg', alt: 'Frente do Pateo' },
                        { src: 'i-tDkvq9p', alt: 'Frente do Pateo' },
                        { src: 'i-LPKNNHF', alt: 'Frente do Pateo' },
                    ];
                    break;
                case 'interior06':
                    this.galleryImages = [
                        { src: 'i-Rv2fckZ', alt: 'Frente do Pateo' },
                        { src: 'i-CNdnk4N', alt: 'Frente do Pateo' },
                        { src: 'i-CbJcbG2', alt: 'Frente do Pateo' },
                        { src: 'i-VDCxhNV', alt: 'Frente do Pateo' },
                        { src: 'i-b57PzZJ', alt: 'Frente do Pateo' },
                        { src: 'i-dcQqgNG', alt: 'Frente do Pateo' },
                        { src: 'i-VdPhXpK', alt: 'Frente do Pateo' },
                        { src: 'i-P2HD34Q', alt: 'Frente do Pateo' },
                        { src: 'i-kXRJ5PP', alt: 'Frente do Pateo' },
                        { src: 'i-j5tP9DS', alt: 'Frente do Pateo' },
                        { src: 'i-5ptVTmX', alt: 'Frente do Pateo' },
                        { src: 'i-pR8VKNZ', alt: 'Frente do Pateo' },
                        { src: 'i-nPLKRJ7', alt: 'Frente do Pateo' },
                        { src: 'i-F4DKrXb', alt: 'Frente do Pateo' },
                        { src: 'i-NHWrCHF', alt: 'Frente do Pateo' },
                        { src: 'i-cLBtDKS', alt: 'Frente do Pateo' },
                        { src: 'i-xgJPCh6', alt: 'Frente do Pateo' },
                        { src: 'i-fPCZT7m', alt: 'Frente do Pateo' },
                        { src: 'i-QzJ77SX', alt: 'Frente do Pateo' },
                        { src: 'i-NPGPr78', alt: 'Frente do Pateo' },
                        { src: 'i-SDdT86B', alt: 'Frente do Pateo' },
                        { src: 'i-PQc7T23', alt: 'Frente do Pateo' },
                        { src: 'i-J9xqwTx', alt: 'Frente do Pateo' },
                        { src: 'i-6NSSZ3D', alt: 'Frente do Pateo' },
                        { src: 'i-Ljxqq56', alt: 'Frente do Pateo' },
                    ];
                    break;
                    case 'exterior06':
                    this.galleryImages = [
                        { src: 'i-zhwjgbW', alt: 'Frente do Pateo' },
                        { src: 'i-5LP2qMx', alt: 'Frente do Pateo' },
                        { src: 'i-JbqKmMS', alt: 'Frente do Pateo' },
                        { src: 'i-5XsMm4p', alt: 'Frente do Pateo' },
                        { src: 'i-52pDwWg', alt: 'Frente do Pateo' },
                        { src: 'i-jXqDrKg', alt: 'Frente do Pateo' },
                        { src: 'i-6ZtMm4k', alt: 'Frente do Pateo' },
                        { src: 'i-CKfJFqN', alt: 'Frente do Pateo' },
                        { src: 'i-kNvQLLh', alt: 'Frente do Pateo' },
                        { src: 'i-X2GxTCf', alt: 'Frente do Pateo' }
                    ];
                    break;
                    case 'interior07':
                    this.galleryImages = [
                        { src: 'i-p5HrmN9', alt: 'Frente do Pateo' },
                        { src: 'i-Pr4QH6L', alt: 'Frente do Pateo' },
                        { src: 'i-XhvTtZF', alt: 'Frente do Pateo' },
                        { src: 'i-zGfrntx', alt: 'Frente do Pateo' },
                        { src: 'i-pN57T8M', alt: 'Frente do Pateo' },
                        { src: 'i-DpTksKL', alt: 'Frente do Pateo' },
                        { src: 'i-rjcJp8p', alt: 'Frente do Pateo' },
                        { src: 'i-FL3m5jn', alt: 'Frente do Pateo' },
                        { src: 'i-5ZTsdR3', alt: 'Frente do Pateo' },
                        { src: 'i-rwXDH3C', alt: 'Frente do Pateo' },
                        { src: 'i-ZpjfwWc', alt: 'Frente do Pateo' },
                        { src: 'i-vdsPGSb', alt: 'Frente do Pateo' },
                        { src: 'i-cjxZhrS', alt: 'Frente do Pateo' },
                        { src: 'i-jVGF5Wv', alt: 'Frente do Pateo' },
                        { src: 'i-VT2DGKP', alt: 'Frente do Pateo' },
                        { src: 'i-bb8vnFH', alt: 'Frente do Pateo' },
                        { src: 'i-MKcpsDx', alt: 'Frente do Pateo' },
                        { src: 'i-m2Z2VZ3', alt: 'Frente do Pateo' },
                        { src: 'i-KLzbJdP', alt: 'Frente do Pateo' },
                        { src: 'i-kZbR4b7', alt: 'Frente do Pateo' },
                        { src: 'i-rtNBkvR', alt: 'Frente do Pateo' },
                        { src: 'i-jXzfknQ', alt: 'Frente do Pateo' },
                        { src: 'i-Xb7drm4', alt: 'Frente do Pateo' },
                        { src: 'i-3zbR35n', alt: 'Frente do Pateo' },
                        { src: 'i-Bq4D797', alt: 'Frente do Pateo' }
                    ];
                    break;
                    case 'exterior07':
                        this.galleryImages = [
                            { src: 'i-Q4vZN8k', alt: 'Frente do Pateo' },
                            { src: 'i-mMSLDqx', alt: 'Frente do Pateo' },
                            { src: 'i-6ntqXVL', alt: 'Frente do Pateo' },
                            { src: 'i-8LnDqsw', alt: 'Frente do Pateo' },
                            { src: 'i-ZzkmmXm', alt: 'Frente do Pateo' },
                            { src: 'i-s4b4qHC', alt: 'Frente do Pateo' },
                            { src: 'i-Pnbg7tQ', alt: 'Frente do Pateo' },
                            { src: 'i-XDZSncQ', alt: 'Frente do Pateo' },
                            { src: 'i-t4b4s99', alt: 'Frente do Pateo' }
                    ];
                    break;  
                default:
                    this.galleryImages = [];
            }

            this.showGallery = true;
        },

        closeGallery() {
            this.showGallery = false;
            this.fullScreenImage = null;
        },

        showFullImage(image) {
            this.fullScreenImage = image;
        },

        closeFullImage() {
            this.fullScreenImage = null;
        },

        addSewageLines() {
            const sewageLineOptions = { color: 'blue', weight: 3, opacity: 0.7, dashArray: '10, 10', dashOffset: '0' };

            if (this.markerRefs.CV0 && this.markerRefs.CV1) {
                const polyline = L.polyline([this.markerRefs.CV0.location, this.markerRefs.CV1.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
                this.markerRefs.CV0_CV1_line = polyline;
            }

            if (this.markerRefs.CV1 && this.markerRefs.CV2) {
                const polyline = L.polyline([this.markerRefs.CV1.location, this.markerRefs.CV2.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
                this.markerRefs.CV1_CV2_line = polyline;
            }

            // Add polyline between CV2 and CV3
            if (this.markerRefs.CV2 && this.markerRefs.CV3) {
                const polyline = L.polyline([this.markerRefs.CV2.location, this.markerRefs.CV3.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
                this.markerRefs.CV2_CV3_line = polyline;
            }

            // Add polyline between CV3 and CV4
            if (this.markerRefs.CV3 && this.markerRefs.CV4) {
                const polyline = L.polyline([this.markerRefs.CV3.location, this.markerRefs.CV4.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
                this.markerRefs.CV3_CV4_line = polyline;
            }

            // Add polyline between CV4 and CV5
            if (this.markerRefs.CV4 && this.markerRefs.CV5) {
                const polyline = L.polyline([this.markerRefs.CV4.location, this.markerRefs.CV5.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
                this.markerRefs.CV4_CV5_line = polyline;
            }

            // Add polyline between CV6 and CV7
            if (this.markerRefs.CV6 && this.markerRefs.CV7) {
                const polyline = L.polyline([this.markerRefs.CV6.location, this.markerRefs.CV7.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
                this.markerRefs.CV6_CV7_line = polyline;
            }
            if (this.markerRefs.CV7 && this.markerRefs.CV8) {
                const polyline = L.polyline([this.markerRefs.CV7.location, this.markerRefs.CV8.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
                this.markerRefs.CV7_CV8_line = polyline;
            }
            if (this.markerRefs.CV8 && this.markerRefs.CV9) {
                const polyline = L.polyline([this.markerRefs.CV8.location, this.markerRefs.CV9.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
                this.markerRefs.CV9_CV8_line = polyline;
            }
            if (this.markerRefs.CV0 && this.markerRefs.CV9) {
                const polyline = L.polyline([this.markerRefs.CV0.location, this.markerRefs.CV9.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
                this.markerRefs.CV9_CV0_line = polyline;
            }
        },
    },
    beforeUnmount() {
        // Remove resize listener when component is destroyed
        window.removeEventListener('resize', this.onResize);
        this.clearMap();
    }
};
</script>

<style scoped>
.map-container {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
    /* Prevent scrollbars */
}

#map {
    height: 100%;
    width: 100%;
    border: none;
    margin: 0;
    padding: 0;
}

/* Overlay for transition effects */
.image-transition-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none;
}

.image-transition-overlay.fade-out {
    opacity: 0.7;
}

.image-transition-overlay.hidden {
    display: none;
}

/* Override any potential Leaflet container padding */
:global(.leaflet-container) {
    background: #000 !important;
    /* Dark background to fill any gaps */
}

/* Add transition for the image overlays */
:global(.fadeable-image) {
    transition: opacity 0.3s ease-in-out !important;
}

/* Gallery styles */
.gallery-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1500;
    display: flex;
    justify-content: center;
    align-items: center;
}

.gallery-content {
    position: relative;
    width: 80%;
    max-width: 1200px;
    max-height: 80vh;
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    overflow-y: auto;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #333;
}

.gallery-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 10px;
}

.gallery-images img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    cursor: pointer;
    border-radius: 4px;
    transition: transform 0.2s;
}

.gallery-images img:hover {
    transform: scale(1.05);
}

.full-screen-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1600;
    cursor: pointer;
}

.full-screen-image img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
}
</style>
