const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middlewares/uploadFiles");
const dbPoll = require("./src/connection/index");
const app = express();
const port = 5000;

const { development } = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const db = new Sequelize(development);

dbPoll.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("connection success");
  }
});

app.use(
  session({
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 2 * 60 * 60 * 1000,
    },
    resave: false,
    store: session.MemoryStore(),
    secret: "session_storage",
    saveUninitialized: true,
  })
);

app.use(flash());

app.set("view engine", "hbs");
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"));
app.use("/uploads", express.static("src/uploads"));
app.use(express.urlencoded({ extended: false })); // body parser untuk memparse permintaan yg masuk

app.get("/", home); 
app.get("/signIn", signIn);
app.post("/signIn", handleSignIn);

app.get("/signUp", signUp);
app.post("/signUp", handleSignUp);

app.get("/project", project);
app.post("/project", upload.single("image"), addProject);

app.get("/project-detail/:id", projectDetail);
app.get("/testimonials", testimonials);
app.get("/contact", contact);
app.get("/delete/:id", handleDeleteProject);

app.get("/editProject/:id", handleEditProjectView);
app.post("/editProject/:id", upload.single("image"), handleEditProject);

app.get("/logout", handleLogout);

const data = [];

async function home(req, res) {
  const query = await db.query(
    `select projects.id, project_name, start_date,end_date ,technologies, author, image, description,  projects."createdAt", projects."updatedAt", users.username as users from projects inner join users on projects.author = users.id order by projects.id desc`,
    {
      type: QueryTypes.SELECT,
    }
  );

  res.render("home", {
    data: query,
    isLogin: req.session.isLogin,
    username: req.session.username,
  });
}

function signIn(req, res) {
  res.render("signIn");
} 

async function handleSignIn(req, res) {
  try {
    const { email, password } = req.body;

    const checkEmail = await db.query(
      `select * from users where email = '${email}' `,
      { type: QueryTypes.SELECT }
    );

    if (!checkEmail.length) {
      req.flash("failed", "No account found with this email");
      return res.redirect("/signIn");
    }

    bcrypt.compare(password, checkEmail[0].password, (err, result) => {
      if (!result) {
        req.flash("info", "No password found");

        return res.redirect("/signIn");
      } else {
        req.session.isLogin = true; 
        req.session.username = checkEmail[0].username;
        req.session.userId = checkEmail[0].id;

        return res.redirect("/");
      }
    });

    console.log({ checkEmail });
  } catch (error) {
    console.log(error);
  }
}

function handleLogout(req, res) {
  res.redirect("/");

  req.session.destroy((err) => {
    if (err) {
      console.log("Error Session:", err);
    } else {
      console.log("Logout successfully");
    }
  });
}

function signUp(req, res) {
  res.render("signUp");
}

async function handleSignUp(req, res) {
  try {
    const { username, email, password } = req.body;
    const saltRound = 10;

    bcrypt.hash(password, saltRound, async (err, hasPassword) => {
      await db.query(
        `insert into users(username, email,password, "createdAt", "updatedAt") values ('${username}',  '${email}', '${hasPassword}', NOW(), NOW())`
      );
    });

    res.redirect("/signIn");
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function project(req, res) {
  try {
    let projectNewData;

    if (req.session.isLogin) {
      const author = req.session.userId;
      projectNewData = await db.query(
        `select projects.id, project_name, start_date,end_date ,technologies, author, image, description,  projects."createdAt", projects."updatedAt", users.username as users from projects inner join users on projects.author = users.id where author = ${author} order by projects.id desc`,
        {
          type: QueryTypes.SELECT,
        }
      );
    } else {
      projectNewData = await db.query(
        `select projects.id, project_name, start_date,end_date ,technologies, author, image, description,  projects."createdAt", projects."updatedAt", users.username as users from projects inner join users on projects.author = users.id order by projects.id desc`,
        {
          type: QueryTypes.SELECT,
        }
      );
    }

    const data = projectNewData.map((res) => ({
      ...res,
      isLogin: req.session.isLogin,
    }));

    // console.log(data)

    // console.log(projectNewData);
    res.render("project", {
      title: "My Project",
      data,
      isLogin: req.session.isLogin,
      username: req.session.username,
    });
  } catch (error) {
    throw error;
  }
}

async function addProject(req, res) {
  try {
    const { projectName, startDate, endDate, technologies, description } =
      req.body;

    const image = req.file.filename;
    const author = req.session.userId;

    console.log(image);

    await db.query(
      `INSERT INTO projects(project_name, start_date, end_date, technologies, author, image, description, "createdAt", "updatedAt") VALUES ('${projectName}', '${startDate}','${endDate}', '{${technologies}}',${author}, '${image}', '${description}', NOW(), NOW())`,
      { type: QueryTypes.INSERT }
    );

    res.redirect("/project");
  } catch (error) {
    throw error;
  }
}

async function projectDetail(req, res) {
  const { id } = req.params;

  const projectDetailData = await db.query(
    `select * from projects where id = ${id}`
  );

  const isLogin = req.session.isLogin;
  const username = isLogin ? req.session.username : null;
  // console.log(projectDetailData);
  res.render("project-detail", {
    data: projectDetailData[0][0],
    isLogin: isLogin,
    username: username,
  });
}

function testimonials(req, res) {
  res.render("testimonials", {
    isLogin: req.session.isLogin,
    username: req.session.username,
  });
}

function contact(req, res) {
  res.render("contact", {
    isLogin: req.session.isLogin,
    username: req.session.username,
  });
}

async function handleDeleteProject(req, res) {
  const { id } = req.params;
  await db.query(`delete from projects where id = ${id}`);

  // console.log(data)
  res.redirect("/project");
}

async function handleEditProjectView(req, res) {
  const { id } = req.params;
  const editProjectData = await db.query(
    `select * from projects where id = ${id} `
  );
  // console.log(editProjectData[0][0]);
  res.render("editProject", {
    data: editProjectData[0][0],
    isLogin: req.session.isLogin,
    username: req.session.username,
  });
}

async function handleEditProject(req, res) {
  try {
    const { id } = req.params;
    const { projectName, startDate, endDate, technologies, description } =
      req.body;

    let image = "";

    if (req.file) {
      image = req.file.filename;
      console.log(image);
    }

    let updateQuery = `update projects set project_name= '${projectName}', start_date = '${startDate}', end_date = '${endDate}', technologies='{${technologies}}', description= '${description}', "updatedAt"=now()`;

    if (image !== "") {
      updateQuery += `, image = '${image}'`;
    }

    updateQuery += ` where id = ${id}`;

    await db.query(updateQuery);

    res.redirect("/project");
  } catch (error) {
    throw error;
  }
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
