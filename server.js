const  express=require("express");
const app=express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const site = require("./routes/site");
app.use("/", site);

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use(express.static(__dirname + '/public'));

app.listen(3000, () => {
    console.log(`Server listening on 3000`);
  });
  