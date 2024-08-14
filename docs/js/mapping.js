function mapBandToFrequency(band) {
    switch (band) {
        case "Flexible broadband services (FBS) (600 MHz)":
            return 600;
        
        case "Mobile Broadband Service":
            return 700;

        case "Cellular":
            return 850;

        case "Personal Communication Service (Block G)":
        case "Personal Communication Service": 
            return 1900;
        
        case "Advanced Wireless Service":
        case "Advanced Wireless Service- Band 3":
        case "Advanced Wireless Service- Band 4": 
            return 2100;
        
        case "Wireless Communication Services": 
            return 2300;
        
        case "Broadband Radio Service":
            return 2600;

        case "Flexible broadband services (FBS) (3500 MHz)": 
            return 3500;

        case "Flexible broadband services (FBS) (3800 MHz)":
            return 3500; // we combine 3500 and 3800 because they are adjacent

        default:
            console.error("Unknown band: " + band);
            return null;
    }
}