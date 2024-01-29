class Testimonial {
    constructor(job, image, author, rating, description) {
      this.job = job;
      this.image = image;
      this.author = author;
      this.rating = rating;
      this.description = description;
    }
  
    getHTML() {
      return `<li class="content-li-testimoni">
        <div class="testimoni-header">
          <img src="${this.image}" alt="${this.author}" class="testimoni-img"/>
        </div>
        <div style="margin-top: 20px">
          <p class="testimoni-description">"${this.description}"</p>
          <div class="testimoni-name">
            <h5 class="header-name">- ${this.author}</h5>
            <p class="header-job">${this.job}</p>
          </div>
        </div>
      </li>`;
    }
  }
  
  // tujuannya mengkonversi atau membuat instance baru dari kelas 'Testimonial' berdasarkan data yg diberikan,
  const testimonialInstanceData = (data) => {
    return new Testimonial(
      data.job,
      data.image,
      data.author,
      data.rating,
      data.description
    );
  };
  
  function getTestimonialData() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
  
      xhr.open("GET", "https://api.npoint.io/03e9110f435f690b7627", true);
  
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else {
          reject("error data");
        }
      };
      xhr.onerror = () => {
        reject("Network error");
      };
      xhr.send();
    });
  }
  
  // getTestimonialData();
  const testimonialElement = document.getElementById("testimoni");
  
  async function buttonRatingTestimonial(rating) {
    document.getElementById(
      "testimoni"
    ).innerHTML = `<div class="spinner"><div></div><div></div><div></div><div></div></div>`;
    const testimonialsData = await getTestimonialData();
  
    const filteredRating = testimonialsData.filter(
      (value) => value.rating === rating
    );
  
    const testimonialInstance = filteredRating.map((data) =>
      testimonialInstanceData(data)
    );
  
    const filteredHTML = testimonialInstance.map((value) => value.getHTML());
    testimonialElement.innerHTML = filteredHTML.join(" ");
  
    if (!filteredRating.length) {
      testimonialElement.innerHTML = `<h1 class="not-found"><i class="fa-solid fa-face-sad-tear fa-2xl"></i><span class="not">DATA NOT FOUND</span></h1>`;
    }
    // console.log(filteredRating);
  }
  
  async function allTestimonial() {
    testimonialElement.innerHTML = `<div class="spinner"><div></div><div></div><div></div><div></div></div>`
    const testimonialsData = await getTestimonialData();
    console.log(testimonialsData);
  
    const testimonialInstance = testimonialsData.map((data) =>
      testimonialInstanceData(data)
    );
  
    const testimonialHTML = testimonialInstance.map((value) => value.getHTML());
  
    testimonialElement.innerHTML = testimonialHTML.join(" ");
  }
  // console.log(allTestimonial);
  
  allTestimonial();
  