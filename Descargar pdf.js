// Para ajustar el zoom de toda la página
//document.body.style.zoom = "50%";

// Check for trustedTypes support and create a policy
let trustedURL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js";

if (window.trustedTypes && trustedTypes.createPolicy) {
  const policy = trustedTypes.createPolicy("myPolicy", {
    createScriptURL: (input) => input,
  });

  trustedURL = policy.createScriptURL(trustedURL);
}

// Load the jsPDF library using the trusted URL
const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    document.body.appendChild(script);
  });
};

loadScript(trustedURL)
  .then(() => {
    const elements = document.getElementsByTagName("img");
    const pdf = new jsPDF(); // Create a new PDF document
    //const pdf = new jsPDF('p', 'mm', [200,200]);
    //let pdf = new jsPDF('p', 'mm', [200, 150]);
    //const pdf = new jsPDF('l', 'px', [elements[0].height, elements[0].width]);
/*
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [500, 300]
     })
*/
    //console.log('height: '+elements[0].height);
    //console.log('width: '+elements[0].width);

    let addedImage = false; // Bandera para controlar si ya se ha agregado alguna imagen

    for (let i = 0; i < elements.length; i++) {
      const img = elements[i];

      if (/^blob:/.test(img.src)) { // Verifica si la imagen es un blob

        console.log(i);

        const canvasElement = document.createElement("canvas");
        const context = canvasElement.getContext("2d");
        canvasElement.width = img.width;
        canvasElement.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const imgData = canvasElement.toDataURL("image/jpeg", 1.0);

        if (!addedImage) {
          addedImage = true;
        } else {
          pdf.addPage(); // Add a new page for each image except the first one
        }

        pdf.addImage(imgData, "JPEG", 0, 0);
      }else {
        console.log('Fallo en la imagen = ' + i);
      }
    }

    // Download the generated PDF
    pdf.save("download.pdf");
  })
  .catch((error) => {
    console.error("Error loading jsPDF:", error);
  });