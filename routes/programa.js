var express = require("express");
var app = express();
const { check, validationResult, sanitizeBody } = require("express-validator");
// SHOW LIST OF programaS
app.get("/", function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(
            "SELECT * FROM `programa` ORDER BY id_programa ASC",
            function(err, rows, fields) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    res.render("programa/list", {
                        title: "Lista de Programas",
                        data: ""
                    });
                } else {
                    // render to views/programa/list.ejs template file
                    res.render("programa/list", {
                        title: "Lista de Programas",
                        data: rows
                    });
                    console.log("PASO");
                }
            }
        );
    });
});

// SHOW ADD programa FORM
app.get("/add", function(req, res, next) {
    // render to views/programa/add.ejs
    res.render("programa/add", {
        title: "Añadir nuevo Programa",
        nombre: "",
        descripcion: ""
    });
});
// ADD NEW programa POST ACTION
app.post("/add", function(req, res, next) {
    console.log(req.body);
    var result = validationResult(req).array();
    if (result) {
        //No errors were found.  Passed Validation!

        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.programanombre = '   a programa    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('programanombre').trim(); // returns 'a programa'
        ********************************************/
        var programa = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        };
        req.getConnection(function(error, conn) {
            conn.query("INSERT INTO `programa` SET ?", programa, function(
                err,
                result
            ) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);

                    // render to views/programa/add.ejs
                    res.render("programa/add", {
                        title: "Añadir nuevo Programa",
                        nombre: programa.nombre,
                        descripcion: programa.descripcion
                    });
                } else {
                    req.flash("success", "Programa añadido exitosamente!");

                    // render to views/programa/add.ejs
                    res.redirect("/programa");
                }
            });
        });
    } else {
        //Display errors to programa
        var error_msg = "";
        errors.forEach(function(error) {
            error_msg += error.msg + "<br>";
        });
        req.flash("error", error_msg);

        /**
         * Using req.body.nombre
         * because req.param('nombre') is deprecated
         */
        res.render("programa/add", {
            title: "Añadir nuevo Programa",
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        });
    }
});

// SHOW EDIT programa FORM
app.get("/edit/(:id_programa)", function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(
            "SELECT * FROM `programa` WHERE id_programa = " +
                req.params.id_programa,
            function(err, rows, fields) {
                if (err) throw err;

                // if programa not found
                if (rows.length <= 0) {
                    req.flash(
                        "error",
                        "programa not found with id = " + req.params.id_programa
                    );
                    res.redirect("/programa");
                } else {
                    // if programa found
                    // render to views/programas/edit.ejs template file
                    res.render("programa/edit", {
                        title: "Editar programa",
                        // data: rows[0],
                        id: rows[0].id_programa,
                        nombre: rows[0].nombre,
                        descripcion: rows[0].descripcion
                    });
                }
            }
        );
    });
});

// EDIT programa POST ACTION
app.post("/edit/(:id_programa)", function(req, res, next) {
    var result = validationResult(req).array();

    if (result) {
        //No errors were found.  Passed Validation!

        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.programanombre = '   a programa    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('programanombre').trim(); // returns 'a programa'
        ********************************************/
        var programa = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        };

        req.getConnection(function(error, conn) {
            conn.query(
                "UPDATE `programa` SET ? WHERE id_programa = " +
                    req.params.id_programa,
                programa,
                function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash("error", err);

                        // render to views/programa/edit.ejs
                        res.render("programa/edit", {
                            title: "Editar Programa",
                            id: req.params.id_programa,
                            nombre: req.body.nombre,
                            descripcion: req.body.descripcion
                        });
                    } else {
                        req.flash(
                            "success",
                            "Programa Actualizado Exitosamente!"
                        );

                        // render to views/list.ejs
                        res.redirect("/programa");
                    }
                }
            );
        });
    } else {
        //Display errors to programa
        var error_msg = "";
        errors.forEach(function(error) {
            error_msg += error.msg + "<br>";
        });
        req.flash("error", error_msg);

        /**
         * Using req.body.nombre
         * because req.param('nombre') is deprecated
         */

        res.render("programa/edit", {
            title: "Editar Programa",
            id: req.body.id_programa,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        });
    }
});

// DELETE programa
app.delete("/(:id_programa)", function(req, res, next) {
    // var programa = { id: req.params.id_programa };

    req.getConnection(function(error, conn) {
        conn.query(
            "DELETE FROM `programa` WHERE id_programa = " +
                req.params.id_programa,
            function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    // redirect to programas list page
                    res.redirect("/programa");
                } else {
                    req.flash(
                        "success",
                        "Programa Eliminado Exitosamente! id = " +
                            req.params.id_programa
                    );
                    // redirect to programas list page
                    res.redirect("/programa");
                }
            }
        );
    });
});

module.exports = app;
