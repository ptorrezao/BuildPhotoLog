/**
 * Get Points of Interest data based on image dimensions
 * @param {number} imgHeight - Image height
 * @param {number} imgWidth - Image width
 * @returns {Array} Array of POI objects with coordinates relative to image size
 */
export function getPOIs(imgHeight, imgWidth) {
    return [
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
        { name: 'PAE', icon: 'pipe', location: [imgHeight * 0.880, imgWidth * 0.05], description: 'Torneira', date: '20241122' },
        { name: 'CA0', icon: 'pipe', location: [imgHeight * 0.79, imgWidth * 0.08], description: 'Torneira', date: '20241122' },
        { name: 'CA0A', icon: 'pipe', location: [imgHeight * 0.79, imgWidth * 0.65], description: 'Torneira', date: '20241122' },
        { name: 'CA0E1', icon: 'pipe', location: [imgHeight * 0.27, imgWidth * 0.74], description: 'Torneira', date: '20241122' },
        { name: 'CA0E2', icon: 'pipe', location: [imgHeight * 0.09, imgWidth * 0.81], description: 'Torneira', date: '20241122' },
        { name: 'CA1', icon: 'pipe', location: [imgHeight * 0.62, imgWidth * 0.10], description: 'Torneira', date: '20241122' },
        { name: 'CA3', icon: 'pipe', location: [imgHeight * 0.63, imgWidth * 0.24], description: 'Torneira', date: '20241122' },
        { name: 'CA2', interior: true, icon: 'pipe', location: [imgHeight * 0.69, imgWidth * 0.315], description: 'Torneira', date: '20241122' },
        { name: 'CA4A', interior: true, icon: 'pipe', location: [imgHeight * 0.60, imgWidth * 0.26], description: 'Torneira', date: '20241122' },
        { name: 'CA4', interior: true, icon: 'pipe', location: [imgHeight * 0.50, imgWidth * 0.26], description: 'Torneira', date: '20241122' },
        { name: 'CA5', interior: true, icon: 'pipe', location: [imgHeight * 0.75, imgWidth * 0.40], description: 'Torneira', date: '20241122' },
        { name: 'CA6', interior: true, icon: 'pipe', location: [imgHeight * 0.75, imgWidth * 0.34], description: 'Torneira', date: '20241122' },
        { name: 'CA7', interior: true, icon: 'pipe', location: [imgHeight * 0.74, imgWidth * 0.32], description: 'Torneira', date: '20241122' },
        { name: 'CA8', interior: true, icon: 'pipe', location: [imgHeight * 0.67, imgWidth * 0.44], description: 'Torneira', date: '20241122' },
        { name: 'CA9', interior: true, icon: 'pipe', location: [imgHeight * 0.680, imgWidth * 0.54], description: 'Torneira', date: '20241122' },
        { name: 'CA10', interior: true, icon: 'pipe', location: [imgHeight * 0.685, imgWidth * 0.50], description: 'Torneira', date: '20241122' },

        { name: 'P0', icon: 'pool', location: [imgHeight * 0.27, imgWidth * 0.68], description: 'Torneira', date: '20241012' },
        { name: 'P1', icon: 'pool', location: [imgHeight * 0.05, imgWidth * 0.825], description: 'Torneira', date: '20241012' },
        { name: 'CV10', icon: 'sewage', location: [imgHeight * 0.05, imgWidth * 0.80], description: 'Caixa de Visita do Esgoto 9', date: '20241116' },

        { name: 'PA0', icon: 'water', location: [imgHeight * 0.960, imgWidth * 0.215], description: 'Torneira', date: '20250201' },
        { name: 'PA1', icon: 'water', location: [imgHeight * 0.745, imgWidth * 0.935], description: 'Torneira', date: '20250201' },
        { name: 'PA2', icon: 'water', location: [imgHeight * 0.050, imgWidth * 0.835], description: 'Torneira', date: '20250201' },
        { name: 'PA3', icon: 'water', location: [imgHeight * 0.050, imgWidth * 0.660], description: 'Torneira', date: '20250201' },
        { name: 'PA4', icon: 'water', location: [imgHeight * 0.050, imgWidth * 0.690], description: 'Chuveiro', date: '20250201' },

        // Electrical substation
        { name: 'PEE', icon: 'electric', location: [imgHeight * 0.910, imgWidth * 0.05], description: 'Subestação Elétrica', date: '20241120' },
        { name: 'PE0', icon: 'electric', location: [imgHeight * 0.79, imgWidth * 0.09], description: 'Subestação Elétrica', date: '20241120' },
        { name: 'PE1', icon: 'electric', location: [imgHeight * 0.62, imgWidth * 0.11], description: 'Subestação Elétrica', date: '20241120' },
        { name: 'PE2', icon: 'electric', location: [imgHeight * 0.62, imgWidth * 0.180], description: 'Subestação Elétrica', date: '20241120' },
        { name: 'PE3', icon: 'electric', location: [imgHeight * 0.62, imgWidth * 0.180], description: 'Subestação Elétrica', date: '20241120' },
        { name: 'PE4', icon: 'electric', location: [imgHeight * 0.61, imgWidth * 0.240], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE5', icon: 'electric', location: [imgHeight * 0.55, imgWidth * 0.040], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE6', icon: 'electric', location: [imgHeight * 0.62, imgWidth * 0.11], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE7', icon: 'lamp', location: [imgHeight * 0.45, imgWidth * 0.040], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE8', icon: 'lamp', location: [imgHeight * 0.24, imgWidth * 0.040], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE9', icon: 'lamp', location: [imgHeight * 0.05, imgWidth * 0.090], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE10', icon: 'lamp', location: [imgHeight * 0.05, imgWidth * 0.250], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE11', icon: 'lamp', location: [imgHeight * 0.05, imgWidth * 0.380], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE12', icon: 'lamp', location: [imgHeight * 0.05, imgWidth * 0.530], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE13', icon: 'lamp', location: [imgHeight * 0.05, imgWidth * 0.680], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE14', icon: 'lamp', location: [imgHeight * 0.94, imgWidth * 0.680], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE15', icon: 'lamp', location: [imgHeight * 0.94, imgWidth * 0.530], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE16', icon: 'lamp', location: [imgHeight * 0.94, imgWidth * 0.380], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE17', icon: 'lamp', location: [imgHeight * 0.94, imgWidth * 0.250], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE18', icon: 'lamp', location: [imgHeight * 0.95, imgWidth * 0.080], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE19', icon: 'lamp', location: [imgHeight * 0.94, imgWidth * 0.820], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE20', icon: 'lamp', location: [imgHeight * 0.80, imgWidth * 0.920], description: 'Subestação Elétrica', date: '20241206' },
        { name: 'PE21', icon: 'lamp', location: [imgHeight * 0.59, imgWidth * 0.920], description: 'Subestação Elétrica', date: '20241206' },



        { name: 'PC2', icon: 'telcom', location: [imgHeight * 0.62, imgWidth * 0.25], description: 'Subestação Elétrica', date: '20241110' },
        { name: 'PC1', icon: 'telcom', location: [imgHeight * 0.62, imgWidth * 0.199], description: 'Subestação Elétrica', date: '20241110' },
        { name: 'PCE', icon: 'telcom', location: [imgHeight * 0.61, imgWidth * 0.04], description: 'Subestação Elétrica', date: '20241110' },

        // Gallery marker
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.50, imgWidth * 0.5], description: 'Fotos', date: '20240515', isGallery: true, galleryId: 'before' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.85, imgWidth * 0.1], description: 'Fotos', date: '20240515', isGallery: true, galleryId: 'geodrenos' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.65, imgWidth * 0.8], description: 'Fotos', date: '20240515', isGallery: true, galleryId: 'lake' },

        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.50, imgWidth * 0.5], description: 'Fotos', date: '20240611', isGallery: true, galleryId: 'lage' },

        // 20240729
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.50, imgWidth * 0.50], description: 'Fotos', date: '20240729', isGallery: true, galleryId: 'struture-building' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.40], description: 'Fotos', date: '20240729', isGallery: true, galleryId: 'struture-placagem' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.85, imgWidth * 0.40], description: 'Fotos', date: '20240729', isGallery: true, galleryId: 'R6VhpZP' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.75, imgWidth * 0.12], description: 'Fotos', date: '20240729', isGallery: true, galleryId: 'KJPJ8s3' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.10, imgWidth * 0.10], description: 'Fotos', date: '20240729', isGallery: true, galleryId: 'Gd465vD' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.55, imgWidth * 0.15], description: 'Fotos', date: '20240729', isGallery: true, galleryId: '86P4hVV' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.18, imgWidth * 0.25], description: 'Fotos', date: '20240729', isGallery: true, galleryId: 'nTV6p53' },

        // 20240910
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.40], description: 'Fotos', date: '20240910', isGallery: true, galleryId: 'struture-interior' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.20, imgWidth * 0.80], description: 'Fotos', date: '20240910', isGallery: true, galleryId: 'VxqTwBp' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.53, imgWidth * 0.39], description: 'Fotos', date: '20240910', isGallery: true, galleryId: 'xZsHz3H' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.52, imgWidth * 0.43], description: 'Fotos', date: '20240910', isGallery: true, galleryId: 'kpZhqFK' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.72, imgWidth * 0.28], description: 'Fotos', date: '20240910', isGallery: true, galleryId: 'C2hpQ22' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.72, imgWidth * 0.52], description: 'Fotos', date: '20240910', isGallery: true, galleryId: 'qtBN7Th' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.72, imgWidth * 0.38], description: 'Fotos', date: '20240910', isGallery: true, galleryId: 'Nx97FRX' },


        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.25, imgWidth * 0.95], description: 'Fotos', date: '20240927', isGallery: true, galleryId: 'chinese-case' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.10, imgWidth * 0.45], description: 'Fotos', date: '20240927', isGallery: true, galleryId: 'night-view' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.35, imgWidth * 0.28], description: 'Fotos', date: '20240927', isGallery: true, galleryId: 'internal-view01' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.74, imgWidth * 0.30], description: 'Fotos', date: '20240927', isGallery: true, galleryId: 'internal-view02' },
        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.77, imgWidth * 0.25], description: 'Fotos', date: '20240927', isGallery: true, galleryId: 'DNF7kvd' },

        { name: 'Galeria', icon: 'gallery', location: [imgHeight * 0.24, imgWidth * 0.60], description: 'Fotos', date: '20240919', isGallery: true, galleryId: 'pool-prep' },

        // 20241012
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.20], description: 'Fotos', date: '20241012', isGallery: true, galleryId: 'roofInspect' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.74, imgWidth * 0.30], description: 'Fotos', date: '20241012', isGallery: true, galleryId: 'water-damage01' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.74, imgWidth * 0.40], description: 'Fotos', date: '20241012', isGallery: true, galleryId: 'water-damage02' },

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


        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.75], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'exterior06' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.64, imgWidth * 0.48], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'interior06' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.17, imgWidth * 0.30], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'Ljxqq56' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.48, imgWidth * 0.32], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'CNdnk4N' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.58, imgWidth * 0.42], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'QzJ77SX' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.58, imgWidth * 0.47], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'fPCZT7m' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.18, imgWidth * 0.34], description: 'Fotos', date: '20250519', isGallery: true, galleryId: '6NSSZ3D' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.18, imgWidth * 0.23], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'J9xqwTx' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.42, imgWidth * 0.32], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'PQc7T23' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.52, imgWidth * 0.25], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'VDCxhNV' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.54, imgWidth * 0.28], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'b57PzZJ' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.28], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'VdPhXpK' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.69, imgWidth * 0.42], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'j5tP9DS' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.74, imgWidth * 0.30], description: 'Fotos', date: '20250519', isGallery: true, galleryId: 'CbJcbG2' },

        // 20250530
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.19, imgWidth * 0.30], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'jVGF5Wv' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.64, imgWidth * 0.36], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'Bq4D797' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.68, imgWidth * 0.57], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'p5HrmN9' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.64, imgWidth * 0.45], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'jXzfknQ' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.64, imgWidth * 0.52], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'rtNBkvR' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.64, imgWidth * 0.39], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'zGfrntx' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.60, imgWidth * 0.26], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'kZbR4b7' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.67, imgWidth * 0.33], description: 'Fotos', date: '20250530', isGallery: true, galleryId: '3zbR35n' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.57, imgWidth * 0.29], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'Xb7drm4' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.72, imgWidth * 0.53], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'KLzbJdP' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.54, imgWidth * 0.28], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'm2Z2VZ3' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.52, imgWidth * 0.24], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'MKcpsDx' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.43, imgWidth * 0.32], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'bb8vnFH' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.69, imgWidth * 0.41], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'vdsPGSb' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.73, imgWidth * 0.30], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'rwXDH3C' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.50, imgWidth * 0.40], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'Pr4QH6L' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.87, imgWidth * 0.19], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'cjxZhrS' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.64, imgWidth * 0.22], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'Q4vZN8k' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.87, imgWidth * 0.23], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 't4b4s99' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.87, imgWidth * 0.35], description: 'Fotos', date: '20250530', isGallery: true, galleryId: '8LnDqsw' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.44, imgWidth * 0.38], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'XDZSncQ' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.15, imgWidth * 0.20], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'Pnbg7tQ' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.87, imgWidth * 0.63], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 's4b4qHC' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.09, imgWidth * 0.69], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'mMSLDqx' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.07, imgWidth * 0.38], description: 'Fotos', date: '20250530', isGallery: true, galleryId: '6ntqXVL' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.60, imgWidth * 0.1], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'construction' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.30, imgWidth * 0.1], description: 'Fotos', date: '20250530', isGallery: true, galleryId: 'olivetree' },

        // 20250714
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.60, imgWidth * 0.60], description: 'Fotos', date: '20250714', isGallery: true, galleryId: 'KvzLG8m' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.55, imgWidth * 0.50], description: 'Fotos', date: '20250714', isGallery: true, galleryId: 'mbLbGJF' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.55, imgWidth * 0.40], description: 'Fotos', date: '20250714', isGallery: true, galleryId: 'QCxQ97Q' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.65, imgWidth * 0.40], description: 'Fotos', date: '20250714', isGallery: true, galleryId: 'kTqFGPx' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.55, imgWidth * 0.30], description: 'Fotos', date: '20250714', isGallery: true, galleryId: 'LK59fHF' },
        { name: 'Galeria', interior: true, icon: 'gallery', location: [imgHeight * 0.40, imgWidth * 0.33], description: 'Fotos', date: '20250714', isGallery: true, galleryId: '879kqSf' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.13, imgWidth * 0.38], description: 'Fotos', date: '20250714', isGallery: true, galleryId: 'QHt5Mg7' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.92, imgWidth * 0.18], description: 'Fotos', date: '20250714', isGallery: true, galleryId: 'qLwwnhj' },
        { name: 'Galeria', interior: false, icon: 'gallery', location: [imgHeight * 0.25, imgWidth * 0.63], description: 'Fotos', date: '20250714', isGallery: true, galleryId: 'vnccgBW' },
        
    ];
}
