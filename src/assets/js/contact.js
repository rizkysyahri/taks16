function submitData() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;
  
    const formData = [
      {
        name,
        email,
        phoneNumber,
        subject,
        message,
      },
    ];
  
    console.log(formData);
  
    if (name == "") {
      return alert("Missing name");
    } else if (email == "") {
      return alert("Missing email");
    } else if (phoneNumber == "") {
      return alert("Missing phone number");
    } else if (subject == "") {
      return alert("Please select a subject");
    } else if (message == "") {
      return alert("Missing message");
    }
  
    let a = document.createElement("a");
  
    a.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(
      message
    )}, nama=${encodeURIComponent(name)}, kontak saya=${encodeURIComponent(
      phoneNumber
    )}`;
    a.click();
  }
  