//TODO Comment some lines to give better understanding of what is going on

//Function to convert image to base64 inspired from HaNdTriX/image_to_data_url.js

console.log("Its working");
function getBase64ImageFromPngUrl (src){

    //Create an Image object
    var myImage = new Image();

    //Variable to be returned
    var dataURL;

    //Adding image source
	myImage.src = src;
    
    //CORS approval to prevent tainted canvas error
    myImage.crossOrigin = 'Anonymous';
    
    //Create html canvas
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        canvas.height = myImage.naturalHeight;
        canvas.width = myImage.naturalWidth;
        
        //Draw image to a canvas
        ctx.drawImage(myImage,0,0);

        //Convert canvas to data URL
        dataURL = canvas.toDataURL(dataURL);


    if (myImage.complete || myImage.complete == undefined){
        myImage.src = "data:image/gif;base64,R0lGOD1hAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
        myImage.src = src;
    }

    //Return the data url
    return dataURL;

}

const selectedImage = new Image();

document.getElementById("btn1").onclick = function() {


selectedImage.src = getBase64ImageFromPngUrl('https://cdn.pixabay.com/photo/2017/09/28/14/53/figure-2795793_960_720.png');

let root = document.documentElement;

root.style.setProperty('--width-var', selectedImage.naturalWidth + " px");
root.style.setProperty('--height-var', selectedImage.naturalHeight + " px");
};


selectedImage.onload = function(){

    const myCanvas = document.getElementById('canvas1');
    const ctx = myCanvas.getContext('2d');
    myCanvas.width=selectedImage.naturalWidth;
    myCanvas.height=selectedImage.naturalHeight;
    ctx.drawImage(selectedImage, 0, 0, myCanvas.width, myCanvas.height);

    const pixels = ctx.getImageData(0, 0, myCanvas.width, myCanvas.height);

    console.log(pixels);
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);

    let particlesArray = [];
    const numberOfParticles = 7000;

    let mappedImage = [];
    for (let y = 0; y < myCanvas.height; y++){
        let row = [];
        for(let x = 0; x < myCanvas.width; x++){
            const red = pixels.data[(y*4*pixels.width) + (x*4)];
            const green = pixels.data[(y*4*pixels.width) + (x*4 + 1)];
            const blue = pixels.data[(y*4*pixels.width) + (x*4 + 2)];
            const brightness = calculateRelativeBrightness(red,green,blue);
            const cell = [
                cellBrightness = brightness,
            ];
            row.push(cell);
        }
        mappedImage.push(row);
    }
    //console.log(mappedImage);
    function calculateRelativeBrightness(red, green, blue){
        return Math.sqrt(
            (red*red)*0.299 + 
        (green * green) * 0.587 +
        (blue * blue) * 0.114
        )/100;
    }
    class Particle {
        constructor(){
            this.x = Math.random() * myCanvas.width;
            this.y = 0;
            this.speed = 0;
            this.velocity = Math.random() * 2.5;
            this.size = Math.random() *1.5 + 1;
            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);
        }
        update(){
            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);
            this.speed = mappedImage[this.position1][this.position2][0];
            
            let movement = (2.5 - this.speed ) + this.velocity;

            this.y += movement;
            if(this.y >= myCanvas.height){
                this.y = 0;
                this.x = Math.random() * myCanvas.width;
            }
        }
        draw(){
            ctx.beginPath();
           // ctx.fillStyle= 'white';
            ctx.fillStyle = 'rgb('+ pixels.data[(this.position1*4*pixels.width) + (this.position2*4)] +','+pixels.data[(this.position1*4*pixels.width) + (this.position2*4+1)]  +',' + pixels.data[(this.position1*4*pixels.width) + (this.position2*4+2)] +')';
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            ctx.fill();
        }
    }
    function init(){
        for (let index = 0; index < numberOfParticles; index++) {
            particlesArray.push(new Particle);
        }
    }
    init();
    function animate(){
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = 'rgb(0,0,0)'
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
        ctx.globalAlpha= 0.2;        
        for (let index = 0; index < particlesArray.length; index++) {
            particlesArray[index].update();
            //ctx.globalAlpha = particlesArray[index].speed*0.5;
            particlesArray[index].draw();
            
        }
        requestAnimationFrame(animate);
    }
    animate();
}

