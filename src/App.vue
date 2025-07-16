<template>
    <div class="app">
        <div class="control-panel">
            <h1>HousePOI Map</h1>
            <div class="image-selector">
                <select v-model="selectedDate" @change="updateImage">
                    <option v-for="date in availableDates" :key="date" :value="date">
                        {{ formatDate(date) }}
                    </option>
                </select>
                <button @click="toggleSlideshow">
                    {{ isSlideshow ? 'Stop Slideshow' : 'Start Slideshow' }}
                </button>
            </div>
            <div>
                <button @click="toogleFloorPlant">
                    {{ showFloorPlant ? 'Hide Floor Plant' : 'Show Floor Plant' }}
                </button>
                <br>
                <button @click="togglePOI">
                    {{ hidePOI ? 'Show POI' : 'Hide POI' }}
                </button>
                <button @click="toggleGallery">
                    {{ showGalery ? 'Hide Galery' : 'Show Galery' }}
                </button>
            </div>
        </div>
        <LeafletMap 
            :imageUrl="currentImageUrl" 
            :showFloorPlant="showFloorPlant" 
            :hidePOI="hidePOI"
            :showGalery="showGalery" />
            
        <div class="slider-container">
            <div class="slider-label">{{ formatDate(selectedDate) }}</div>
            <input 
                type="range" 
                min="0" 
                :max="availableDates.length - 1" 
                :value="currentSliderIndex" 
                @input="onSliderChange($event)"
                class="timeline-slider">
        </div>
    </div>
</template>

<script>
import LeafletMap from './components/LeafletMap.vue';

export default {
    name: 'App',
    components: {
        LeafletMap
    },
    data() {
        return {
            selectedDate: '2025-07-14',
            currentImageUrl: '/images/20250714.jpg',
            showFloorPlant: false,
            hidePOI: false,
            showGalery: true,
            isSlideshow: false,
            slideshowTimer: null,
            availableDates: [
                '2024-01-01',
                '2024-05-15',
                '2024-06-01',
                '2024-06-11',
                '2024-07-29',
                '2024-09-10',
                '2024-09-19',
                '2024-09-27',
                '2024-10-12',
                '2024-11-17',
                '2024-11-22',
                '2024-12-06',
                '2025-02-10',
                '2025-05-04',
                '2025-05-19',
                '2025-05-30',
                '2025-07-14'
            ],
            images: {
                '2024-01-01': '/images/20240101.jpg',
                '2024-05-15': '/images/20240515.jpg',
                '2024-06-01': '/images/20240601.jpg',
                '2024-06-11': '/images/20240611.jpg',
                '2024-07-29': '/images/20240729.jpg',
                '2024-09-10': '/images/20240910.jpg',
                '2024-09-19': '/images/20240919.jpg',
                '2024-09-27': '/images/20240927.jpg',
                '2024-10-12': '/images/20241012.jpg',
                '2024-11-17': '/images/20241117.jpg',
                '2024-11-22': '/images/20241122.jpg',
                '2024-12-06': '/images/20241206.jpg',
                '2025-02-10': '/images/20250210.jpg',
                '2025-05-04': '/images/20250504.jpg',
                '2025-05-19': '/images/20250519.jpg',
                '2025-05-30': '/images/20250530.jpg',
                '2025-07-14': '/images/20250714.jpg'
            }
        };
    },
    computed: {
        currentSliderIndex() {
            return this.availableDates.findIndex(date => date === this.selectedDate);
        }
    },
    methods: {
        updateImage() {
            const newImageUrl = this.images[this.selectedDate];
            if (newImageUrl) {
                this.currentImageUrl = newImageUrl;
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        },
        toogleFloorPlant() {
            this.showFloorPlant = !this.showFloorPlant;
        },
        togglePOI() {
            this.hidePOI = !this.hidePOI;
        },
        toggleGallery() {
            this.showGalery = !this.showGalery;
        },
        toggleSlideshow() {
            if (this.isSlideshow) {
                this.stopSlideshow();
            } else {
                this.startSlideshow();
            }
        },
        startSlideshow() {
            this.isSlideshow = true;
            this.slideshowTimer = setInterval(() => {
                const currentIndex = this.availableDates.findIndex(date => date === this.selectedDate);
                const nextIndex = (currentIndex + 1) % this.availableDates.length;
                this.selectedDate = this.availableDates[nextIndex];
                this.updateImage();
            }, 3000);
        },
        stopSlideshow() {
            this.isSlideshow = false;
            if (this.slideshowTimer) {
                clearInterval(this.slideshowTimer);
                this.slideshowTimer = null;
            }
        },
        onSliderChange(event) {
            const index = parseInt(event.target.value);
            this.selectedDate = this.availableDates[index];
            this.updateImage();
        }
    },
    beforeUnmount() {
        this.stopSlideshow();
    }
}
</script>

<style>
.app {
    font-family: Arial, sans-serif;
    height: 100vh;
    position: relative;
}

.control-panel {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

h1 {
    margin: 0 0 10px 0;
    font-size: 1.5rem;
}

.image-selector {
    display: flex;
    gap: 10px;
}

select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

.slider-container {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    width: 80%;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0.7);
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    z-index: 1000;
}

.slider-label {
    margin-bottom: 8px;
    font-weight: bold;
}

.timeline-slider {
    width: 100%;
    cursor: pointer;
}
</style>
