// project-details.js

function getFullTime(dates) {
    const day = dates.getDate();
    const month = dates.getMonth();
    const year = dates.getFullYear();
  
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  
    return `${day} ${months[month]} ${year}`;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectName = urlParams.get("name");
  
    const projectData = JSON.parse(localStorage.getItem("MY-PROJECT")).find(
      (project) => project.projectName === projectName
    );
  
    if (projectData) {
      document.getElementById("fileUpload").src = projectData.image;
      document.getElementById("input-project-name").textContent =
        projectData.projectName;
      document.getElementById("input-description").textContent =
        projectData.description;
  
      const startDateEl = document.getElementById("start-date");
      const endDateEl = document.getElementById("end-date");
      const startDate = new Date(projectData.startDate);
      const endDate = new Date(projectData.endDate);
  
      // startDateEl.textContent = getFullTime(new Date(projectData.startDateEl));
      // endDateEl.textContent = getFullTime(new Date(projectData.endDateEl));
  
      // dibuat condition karna kalo ga datenya bakal kena NaN undefined
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        startDateEl.textContent = getFullTime(startDate);
        endDateEl.textContent = getFullTime(endDate);
      } else {
        console.log("Invalid date format for startDate or endDate");
      }
  
      // untuk menampilkan icon
  
      const technologies = document.getElementById("technologies");
      const { reactJs, nodeJs, typeScript, nextJs } = projectData;
  
      let technologiesHTML = "";
  
      if (reactJs) {
        technologiesHTML += `
            <div style="display: flex; align-items: center; gap: 1rem;">
              <i class="fa-brands fa-react fa-lg"></i>
              <p class="mb-0">React Js</p>
            </div>`;
      }
      if (nodeJs) {
        technologiesHTML += `
            <div style="display: flex; align-items: center; gap: 1rem;">
              <i class="fa-brands fa-node-js fa-lg"></i>
              <p class="mb-0">Node Js</p>
            </div>`;
      }
      if (typeScript) {
        technologiesHTML += `
            <div style="display: flex; align-items: center; gap: 1rem;">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24"  viewBox="0 0 50 50">
                <path d="M45,4H5C4.447,4,4,4.448,4,5v40c0,0.552,0.447,1,1,1h40c0.553,0,1-0.448,1-1V5C46,4.448,45.553,4,45,4z M29,26.445h-5V42h-4	V26.445h-5V23h14V26.445z M30.121,41.112v-4.158c0,0,2.271,1.712,4.996,1.712c2.725,0,2.62-1.782,2.62-2.026	c0-2.586-7.721-2.586-7.721-8.315c0-7.791,11.25-4.717,11.25-4.717l-0.14,3.704c0,0-1.887-1.258-4.018-1.258s-2.9,1.013-2.9,2.096	c0,2.795,7.791,2.516,7.791,8.141C42,44.955,30.121,41.112,30.121,41.112z"></path>
              </svg>
              <p class="mb-0">TypeScript</p>
            </div>`;
      }
      if (nextJs) {
        technologiesHTML += `
            <div style="display: flex; align-items: center; gap: 1rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 128 128">
                <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"></path>
              </svg>
              <p class="mb-0">Next Js</p>
            </div>`;
      }
      technologies.innerHTML = technologiesHTML;
    }
  });
  