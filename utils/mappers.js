import colors from '../config/colors';

/********************* REPORTS *********************/

export function mapReportTypeToLabel(reportType) {
    reportType = reportType.toLowerCase();
    if (reportType == "lost" || reportType == "stolen") {
        return "Perdido";
    }
    if (reportType == "found") {
        return "Encontrado";
    }
    if (reportType == "for_adoption") {
        return "En adopción";
    }
};

export function mapReportTypeToLabelColor(reportType) {
    reportType = reportType.toLowerCase();
    if (reportType == "lost" || reportType == "stolen") {
        return colors.pink;
    }
    if (reportType == "found") {
        return colors.primary;
    }
    if (reportType == "for_adoption") {
        return colors.secondary;
    }
};

export function mapReportTypeToMapMarkerColor(reportType) {
    reportType = reportType.toLowerCase();
    if (reportType == "lost") {
        return colors.markerLostColor;
    }
    if (reportType == "found") {
        return colors.markerFoundColor;
    }
    if (reportType == "for_adoption") {
        return colors.markerForAdoptionColor;
    }
    if (reportType == "stolen") {
        return colors.markerStolenColor;
    }
};

export function mapReportTypeToMapMarker(reportType) {
    reportType = reportType.toLowerCase();
    if (reportType == "lost") {
        return require('../assets/lostMarker.png');
    }
    if (reportType == "found") {
        return require('../assets/foundMarker.png');
    }
    if (reportType == "for_adoption") {
        return require('../assets/forAdoptionMarker.png');
    }
    if (reportType == "stolen") {
        return require('../assets/stolenMarker.png');
    }
};


/********************* PET *********************/

export function mapPetTypeToLabel(petType) {
    petType = petType.toLowerCase();
    if (petType == "dog") {
        return "Perro";
    }
    if (petType == "cat") {
        return "Gato";
    }
};

export function mapPetSexToLabel(petSex) {
    petSex = petSex.toLowerCase();
    if (petSex == "male") {
        return "Macho";
    }
    if (petSex == "female") {
        return "Hembra";
    }
};

export function mapPetSizeToLabel(petSize) {
    petSize = petSize.toLowerCase();
    if (petSize == "small") {
        return "Pequeño";
    }
    if (petSize == "medium") {
        return "Mediano";
    }
    if (petSize == "large") {
        return "Grande";
    }
};

export function mapPetLifeStageToLabel(petLifeStage) {
    petLifeStage = petLifeStage.toLowerCase();
    if (petLifeStage == "baby") {
        return "Cachorro";
    }
    if (petLifeStage == "adult") {
        return "Adulto";
    }
    if (petLifeStage == "senior") {
        return "Anciano";
    }
};
