/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Darius Bruno Student ID: 047701073 Date: 3/15/2024
*
* Published URL: https://prussian-blue-sea-lion-hose.cyclic.app/
*
********************************************************************************/

const express = require('express');
const path = require('path');

const legoData = require("./modules/legoSets");
const HTTP_PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));



async function startServer() {
    try {
        await legoData.initialize();
        console.log('Initialization successful');

                
        app.get('/', (req, res) => {
            
            res.render("home");
        })

        app.get('/about', (req, res) => {
            
            res.render("about", { page: '/about' });
        })       

        app.get('/lego/sets', (req, res) => {
            
            if (req.query.theme) {
                legoData.getSetsByTheme(req.query.theme)
                    .then(sets => {
                        res.render("sets", { sets: sets, page: '/lego/sets' });
                    })
                    .catch(err => {
                        
                        res.status(404).render("404", { 
                            page: '/404',
                            message: "No sets found for the theme " + req.query.theme
                        });
                    });
            } else {
                
                legoData.getAllSets()
                    .then(sets => {
                        res.render("sets", { sets: sets, page: '/lego/sets' });
                    })
                    .catch(err => {
                        
                        res.status(500).send(err);
                    });
            }
        });

        app.get('/lego/sets/:setNum', (req, res) => {
            legoData.getSetByNum(req.params.setNum)
                .then(legoSet => {
                    res.render("set", { set: legoSet });
                })
                .catch(err => {
                    res.status(404).render("404", {
                        page: '/404',
                        message: err.message || "We're unable to find the sets for the specified theme."
                    });
                });
        });



        app.get('/lego/sets/theme/:themeName', (req, res) => {
            const themeName = req.params.themeName;
            legoData.getSetsByTheme(themeName)
                .then(sets => res.json(sets))
                .catch(err => {
                    res.status(404).render("404", {
                        page: '/404',
                        message: err.message || "We're unable to find the sets for the specified theme."
                    });
                });
        });



        app.get('/lego/sets/num-demo', (req, res) => {
            legoData.getSetByNum("03-1")
                .then(set => res.json(set))
                .catch(err => res.status(404).send(err));
        });


        
        app.use((req, res) => {
            res.status(404).render("404", { 
                page: '/404',
                message: "I'm sorry, we're unable to find what you're looking for"
            });
        });

        app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
            } catch (err) {
                console.error('Initialization failed:', err);
            }
        }

startServer();

