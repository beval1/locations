import Express from 'express';
import {
    Sequelize
} from 'sequelize';
import DataTypes from 'sequelize';
import QueryTypes from 'sequelize';
import cors from 'cors';
//import bodyParser from 'body-parser';

const app = Express();
const port = 3002;
//app.use(bodyParser.json())
// app.use(Express.urlencoded({
//     extended: true
// }));
app.use(Express.json());

const sequelize = new Sequelize('mysql://root:?@localhost:3306/geo_data') // mysql connection

//test connection
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

//Location model
//TO DO: Add validations
const Location = sequelize.define('Location', {
    // Model attributes are defined here
    placeName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "UNKNOWN"
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "UNKNOWN"
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "UNKNOWN"
    },
    street_address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "UNKNOWN"
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
}, {
    // Other model options go here
    tableName: 'locations',
    timestamps: false,
});

//Check if table is created, if it isn't, create it
await sequelize.sync();
console.log("All models were synchronized successfully.");

//cors bypass
app.use(cors())

app.get("/get-locations", async (req, res) => {
    //TO DO: it will be better approach to use SQL statements instead of ORM, Sequelize makes things slower;
    //Consider using MongoDB instead of relational database

    let offset = req.query.offset ? Number(req.query.offset) : 0;
    let limit = req.query.limit ? Number(req.query.limit) : 1;
    console.log(`Limit: ${limit}`)
    console.log(`Offset: ${offset}`)
    let result;
    if (limit - offset > 10) {
        //we only care for latitude and longitude to save bandwith
        result = await Location.findAll({
            attributes: ['latitude', 'longitude'],
            offset: offset,
            limit: limit,
            raw: true
        });
    } else {
        //get everything
        result = await Location.findAll({
            offset: offset,
            limit: limit,
            raw: true
        })
    }
    console.log(result);
    //send data to the client;
    res.json({
        data: result
    })
})

app.get("/get-location", async (req, res) => {
    console.log(req.query.search)

    const result = await sequelize.query("SELECT * FROM locations WHERE street_address LIKE :search", {
        model: Location,
        mapToModel: true,
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            search: `%${req.query.search}%`,
        },
    });
    console.log(result);
    //send data to the client;
    res.json({
        data: result
    })
})

app.get("/get-countries", async (req, res) => {
    const results = await sequelize.query("SELECT DISTINCT country FROM locations ORDER BY country ASC", {
        raw: true,
        type: sequelize.QueryTypes.SELECT
    });
    res.json({
        data: results
    })
});

app.get("/get-cities", async (req, res) => {
    const results = await sequelize.query("SELECT DISTINCT city FROM locations ORDER BY city ASC", {
        raw: true,
        type: sequelize.QueryTypes.SELECT
    });
    res.json({
        data: results
    })
});

app.get("/get-addresses", async (req, res) => {
    console.log(req.query.countries)
    console.log(req.query.cities)

    let countries = [];
    let cities = [];

    if (req.query.countries.includes('All') || req.query.countries == 0) {
        const result = await sequelize.query("SELECT DISTINCT country FROM locations ORDER BY city ASC", {
            raw: true,
            type: sequelize.QueryTypes.SELECT
        });
        result.forEach(r => {
            countries.push(r.country)
        })
    } else {
        countries = Array.from(req.query.countries.split(','))
    }
    if (req.query.cities.includes('All') || req.query.cities == 0) {
        const result = await sequelize.query("SELECT DISTINCT city FROM locations ORDER BY city ASC", {
            raw: true,
            type: sequelize.QueryTypes.SELECT
        });
        result.forEach(r => {
            cities.push(r.city)
        })
    } else {
        cities = Array.from(req.query.cities.split(','))
    }

    console.log(countries)
    console.log(cities)

    let sqlQuery = "SELECT DISTINCT street_address FROM locations WHERE country IN(:countries) AND city IN(:cities) ORDER BY street_address ASC"
    const results = await sequelize.query(sqlQuery, {
        raw: true,
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            countries: countries,
            cities: cities,
        },
    });
    res.json({
        data: results
    })
});

app.post("/add-location", async (req, res) => {
    //get data from request body;
    const data = req.body;
    console.log(data);
    //store in database using ORM;
    const location = await Location.create(data);

    res.json({
        message: "saved successfuly!"
    })
})



app.listen(port, () => console.log("listening on port: " + port))