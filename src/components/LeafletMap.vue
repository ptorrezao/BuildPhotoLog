<template>
    <div class="map-container">
        <div id="map" ref="mapContainer"></div>
        <div class="image-transition-overlay" :class="{ 'fade-out': isTransitioning, 'hidden': !isTransitioning }">
        </div>
        <div v-if="showGallery" class="gallery-modal" @click.self="closeGallery">
            <div class="gallery-content">
                <!-- <p>{{ this.galleryTitle }}</p> -->
                <button class="close-button" @click="closeGallery">&times;</button>
                <div class="gallery-images">
                    <img v-for="(image, index) in galleryImages" :key="index" :src="this.getURL(image.src, 'S')"
                        :alt="image.alt" @click="showFullImage(image, false)">
                </div>
                <div v-if="fullScreenImage" class="full-screen-image" @click="closeFullImage">
                    <img :src="this.getURL(fullScreenImage.src, 'X5')" :alt="fullScreenImage.alt">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import L from 'leaflet';
import { getGalleryImages } from '../utils/galleryData';
import { getPOIs } from '../utils/poisData';

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

const liconSize = [36, 36]; // Default icon size for custom icons
// Define custom icons for different POI types
const customIcons = {
    'lamp': L.icon({ iconUrl: "./icons/lamp.png", shadowUrl: iconShadow, iconSize: liconSize, iconAnchor: [12, 41], popupAnchor: [0, -41] }),
    'pool': L.icon({ iconUrl: "./icons/filter.png", shadowUrl: iconShadow, iconSize: liconSize, iconAnchor: [12, 41], popupAnchor: [0, -41] }),
    'pipe': L.icon({ iconUrl: "./icons/water-pipe.png", shadowUrl: iconShadow, iconSize: liconSize, iconAnchor: [12, 41], popupAnchor: [0, -41] }),
    'well': L.icon({ iconUrl: "./icons/rain-water-harvesting.png", shadowUrl: iconShadow, iconSize: liconSize, iconAnchor: [12, 41], popupAnchor: [0, -41] }),
    'sewage': L.icon({ iconUrl: "./icons/tee.png", shadowUrl: iconShadow, iconSize: liconSize, iconAnchor: [12, 36], popupAnchor: [0, -36] }),
    'water': L.icon({ iconUrl: "./icons/tap.png", shadowUrl: iconShadow, iconSize: liconSize, iconAnchor: [12, 36], popupAnchor: [0, -36] }),
    'electric': L.icon({ iconUrl: "./icons/wire.png", shadowUrl: iconShadow, iconSize: liconSize, iconAnchor: [12, 36], popupAnchor: [0, -36] }),
    'telcom': L.icon({ iconUrl: "./icons/lan.png", shadowUrl: iconShadow, iconSize: liconSize, iconAnchor: [12, 36], popupAnchor: [0, -36] }),
    'gallery': L.icon({ iconUrl: "./icons/camera.png", shadowUrl: iconShadow, iconSize: liconSize, iconAnchor: [12, 42], popupAnchor: [0, -42] }),
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
            default: './images/DJI_0784.jpg'
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
            galleryTitle: '',
            closeGalleryAfterFullScreen: false,
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
                this.clearMap();
                this.loadImageAndInitMap();
            } else {
                this.startTransition();
                this.clearMap();
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

            // Remove image overlay properly - this is the key fix
            if (this.imageOverlay && this.map) {
                try {
                    // First set opacity to 0 to avoid transition glitches
                    this.imageOverlay.setOpacity(0);
                    // Then remove from map
                    this.map.removeLayer(this.imageOverlay);
                } catch (e) {
                    console.log("Error removing overlay:", e);
                }
                this.imageOverlay = null;
            }
            
            // Reset marker references
            this.markerRefs = {};
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
                    // Stop any ongoing map animations first
                    if (this.map._animatingZoom) {
                        try {
                            this.map._onZoomTransitionEnd();
                        } catch (e) {
                            console.log("Error stopping zoom animation:", e);
                        }
                    }
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
                zoomControl: false, // Move zoom control to a better position later
                fadeAnimation: false // Add these options to reduce animation-related errors
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
            // Get POIs from the utility function
            const pois = getPOIs(imgHeight, imgWidth);

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
                if ((poi.interior && this.showFloorPlant) || poi.interior === undefined || poi.interior === false) {
                    const marker = L.marker(poi.location, { icon: markerIcon }).addTo(this.map);

                    if (poi.isGallery) {
                        marker.on('click', () => {
                            const galleryImages = getGalleryImages(poi.galleryId);
                            if (galleryImages.length === 1) {
                                this.showGallery = true;
                                this.showFullImage(galleryImages[0], true);
                            } else {
                                this.openGallery(poi.galleryId, poi.name);
                            }
                        });
                        marker.on('mouseover', () => {
                            marker.openPopup();
                        });
                        marker.bindPopup(`<b>${poi.name}</b><br>${poi.description}<br><i>Clique para ver a galeria ${poi.interior}</i>`);
                    } else {
                        marker.bindPopup(`<b>${poi.name}</b><br>${poi.description}`);
                    }

                    this.markers.push(marker);
                    if (['water', 'sewage', 'pipe','pool','electric','lamp','telcom'].includes(poi.icon)) {
                        this.markerRefs[poi.name] = {
                            marker: marker,
                            location: poi.location,
                            visible: true
                        };
                    }
                }
            });
            // Common polyline options for sewage lines
            this.addSewageLines();
            this.addWaterLines();
            this.addPoolLines();
            this.addElectricLines();
            this.addTelcomLines();
        },

        getURL(image, size) {
            return `https://photos.smugmug.com/photos/${image}/0/MX8rJZ7VmWTrCcW5QLgPbzPnnqCv7xB7rQ4qZjpwX/${size}/${image}.jpg`;
        },
        openGallery(galleryId, title) {
            this.galleryTitle = galleryId || title || 'Galeria de Fotos';
            this.galleryImages = getGalleryImages(galleryId);
            this.showGallery = true;
        },

        closeGallery() {
            this.showGallery = false;
            this.fullScreenImage = null;
        },

        showFullImage(image, closeAfter) {
            this.fullScreenImage = image;
            this.closeGalleryAfterFullScreen = closeAfter;
        },

        closeFullImage() {
            this.fullScreenImage = null;
            this.showGallery = !this.closeGalleryAfterFullScreen;
        },
        addElectricLines(){
            const poolLineOptions = { color: 'yellow', weight: 3, opacity: 0.7, dashArray: '10, 10', dashOffset: '0' };

            if (this.markerRefs.PEE && this.markerRefs.PE0) {
                const polyline = L.polyline([this.markerRefs.PEE.location, this.markerRefs.PE0.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE0 && this.markerRefs.PE1) {
                const polyline = L.polyline([this.markerRefs.PE0.location, this.markerRefs.PE1.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE1 && this.markerRefs.PE2) {
                const polyline = L.polyline([this.markerRefs.PE1.location, this.markerRefs.PE2.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE2 && this.markerRefs.PE3) {
                const polyline = L.polyline([this.markerRefs.PE2.location, this.markerRefs.PE3.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE3 && this.markerRefs.PE4) {
                const polyline = L.polyline([this.markerRefs.PE3.location, this.markerRefs.PE4.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE5 && this.markerRefs.PE6) {
                const polyline = L.polyline([this.markerRefs.PE5.location, this.markerRefs.PE6.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE5 && this.markerRefs.PE7) {
                const polyline = L.polyline([this.markerRefs.PE5.location, this.markerRefs.PE7.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE8 && this.markerRefs.PE7) {
                const polyline = L.polyline([this.markerRefs.PE8.location, this.markerRefs.PE7.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE8 && this.markerRefs.PE9) {
                const polyline = L.polyline([this.markerRefs.PE8.location, this.markerRefs.PE9.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE9 && this.markerRefs.PE10) {
                const polyline = L.polyline([this.markerRefs.PE9.location, this.markerRefs.PE10.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE10 && this.markerRefs.PE11) {
                const polyline = L.polyline([this.markerRefs.PE10.location, this.markerRefs.PE11.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE11 && this.markerRefs.PE12) {
                const polyline = L.polyline([this.markerRefs.PE11.location, this.markerRefs.PE12.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE12 && this.markerRefs.PE13) {
                const polyline = L.polyline([this.markerRefs.PE12.location, this.markerRefs.PE13.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }

            if (this.markerRefs.PE15 && this.markerRefs.PE14)
            {
                const polyline = L.polyline([this.markerRefs.PE14.location, this.markerRefs.PE15.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }

            if (this.markerRefs.PE15 && this.markerRefs.PE16) {
                const polyline = L.polyline([this.markerRefs.PE16.location, this.markerRefs.PE15.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE17 && this.markerRefs.PE16) {
                const polyline = L.polyline([this.markerRefs.PE17.location, this.markerRefs.PE16.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE17 && this.markerRefs.PE18) {
                const polyline = L.polyline([this.markerRefs.PE17.location, this.markerRefs.PE18.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
             if (this.markerRefs.PE6 && this.markerRefs.PE18) {
                const polyline = L.polyline([this.markerRefs.PE6.location, this.markerRefs.PE18.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE15 && this.markerRefs.PE19) {
                const polyline = L.polyline([this.markerRefs.PE15.location, this.markerRefs.PE19.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE20 && this.markerRefs.PE19) {
                const polyline = L.polyline([this.markerRefs.PE20.location, this.markerRefs.PE19.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.PE20 && this.markerRefs.PE21) {
                const polyline = L.polyline([this.markerRefs.PE20.location, this.markerRefs.PE21.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
        },
        addTelcomLines(){
            const poolLineOptions = { color: 'green', weight: 3, opacity: 0.7, dashArray: '10, 10', dashOffset: '0' };

            if (this.markerRefs.PCE && this.markerRefs.PC1) {
                const polyline = L.polyline([this.markerRefs.PCE.location, this.markerRefs.PC1.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }

            if (this.markerRefs.PC2 && this.markerRefs.PC1) {
                const polyline = L.polyline([this.markerRefs.PC2.location, this.markerRefs.PC1.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
        },
        addPoolLines(){
            const poolLineOptions = { color: 'lightblue', weight: 3, opacity: 0.7, dashArray: '10, 10', dashOffset: '0' };

            if (this.markerRefs.P0 && this.markerRefs.P1) {
                const polyline = L.polyline([this.markerRefs.P0.location, this.markerRefs.P1.location], poolLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
        },
        addWaterLines(){
            const sewageLineOptions = { color: 'blue', weight: 3, opacity: 0.7, dashArray: '10, 10', dashOffset: '0' };

            if (this.markerRefs.PAE && this.markerRefs.CA0) {
                const polyline = L.polyline([this.markerRefs.PAE.location, this.markerRefs.CA0.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }

            if (this.markerRefs.CA0 && this.markerRefs.CA1) {
                const polyline = L.polyline([this.markerRefs.CA0.location, this.markerRefs.CA1.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA0 && this.markerRefs.CA0A) {
                const polyline = L.polyline([this.markerRefs.CA0.location, this.markerRefs.CA0A.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }

            if (this.markerRefs.CA3 && this.markerRefs.CA1) {
                const polyline = L.polyline([this.markerRefs.CA3.location, this.markerRefs.CA1.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA3 && this.markerRefs.CA2) {
                const polyline = L.polyline([this.markerRefs.CA3.location, this.markerRefs.CA2.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA2 && this.markerRefs.CA4A) {
                const polyline = L.polyline([this.markerRefs.CA2.location, this.markerRefs.CA4A.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA4 && this.markerRefs.CA4A) {
                const polyline = L.polyline([this.markerRefs.CA4.location, this.markerRefs.CA4A.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA2 && this.markerRefs.CA7) {
                const polyline = L.polyline([this.markerRefs.CA2.location, this.markerRefs.CA7.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA5 && this.markerRefs.CA7) {
                const polyline = L.polyline([this.markerRefs.CA5.location, this.markerRefs.CA7.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA7 && this.markerRefs.CA6) {
                const polyline = L.polyline([this.markerRefs.CA7.location, this.markerRefs.CA6.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA8 && this.markerRefs.CA7) {
                const polyline = L.polyline([this.markerRefs.CA8.location, this.markerRefs.CA7.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA8 && this.markerRefs.CA9) {
                const polyline = L.polyline([this.markerRefs.CA8.location, this.markerRefs.CA9.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA10 && this.markerRefs.CA9) {
                const polyline = L.polyline([this.markerRefs.CA10.location, this.markerRefs.CA9.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA0A && this.markerRefs.PA1) {
                const polyline = L.polyline([this.markerRefs.CA0A.location, this.markerRefs.PA1.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA0A && this.markerRefs.CA0E1) {
                const polyline = L.polyline([this.markerRefs.CA0A.location, this.markerRefs.CA0E1.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
            if (this.markerRefs.CA0E2 && this.markerRefs.CA0E1) {
                const polyline = L.polyline([this.markerRefs.CA0E2.location, this.markerRefs.CA0E1.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
            }
        },
        addSewageLines() {
            const sewageLineOptions = { color: 'brown', weight: 3, opacity: 0.7, dashArray: '10, 10', dashOffset: '0' };

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

            if (this.markerRefs.CV10 && this.markerRefs.CV5) {
                const polyline = L.polyline([this.markerRefs.CV10.location, this.markerRefs.CV5.location], sewageLineOptions).addTo(this.map);
                this.polylines.push(polyline);
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
