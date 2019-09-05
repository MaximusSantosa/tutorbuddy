var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var coursesJson = require('./courses.json');
var courseAreas = ["Mathematics", "Science", "Arts", "Social Studies", "Chinese", "French", "Spanish", "Japanese", "English"]
var cookieParser = require('cookie-parser');
var ObjectId = require('mongodb').ObjectID;
var Long = require('mongodb').Long;

/* Database Singleton Connection Function (make sure only one connection is open at all times) */
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://tutor_root:tutorbuddy123@ds121382.mlab.com:21382/tutorbuddy';
var connection = MongoClient.connect(url);

/* LoggedIn Function */
function isLoggedIn(req) {
  var loggedIn = false;
  if (typeof req.cookies.email !== 'undefined') {
    loggedIn = true;
  }
  return loggedIn;
}

/* GET home page. */
router.get('/', function (req, res, next) {
  var loggedIn = isLoggedIn(req);
  res.render('index', {
    page: 'Home',
    menuId: 'home',
    loggedIn: loggedIn
  });
});

router.get('/about', function (req, res, next) {
  var loggedIn = isLoggedIn(req);
  res.render('about', {
    page: 'About',
    menuId: 'about',
    loggedIn: loggedIn
  });
});

router.get('/leaderboard', function (req, res, next) {
  var loggedIn = isLoggedIn(req);
  res.render('leaderboard', {
    page: 'leaderboard',
    menuId: 'leaderboard',
    loggedIn: loggedIn
  });
});

router.get('/login', function (req, res, next) {
  var loggedIn = isLoggedIn(req);
  res.render('login', {
    page: 'Login',
    menuId: 'leaderboard',
    loggedIn: loggedIn
  });
});

router.get('/login-fail', function (req, res, next) {
  var loggedIn = isLoggedIn(req);
  res.render('login-fail', {
    page: 'Login',
    menuId: 'leaderboard',
    loggedIn: loggedIn
  });
});

router.get('/infoform', function (req, res, next) {
  var loggedIn = isLoggedIn(req)
  res.render('infoform', {
    page: 'Infoform',
    menuId: 'infoform',
    courses: coursesJson,
    areas: courseAreas,
    loggedIn: loggedIn
  });
});

router.get('/updateinfoform', function (req, res, next) {
  var loggedIn = isLoggedIn(req)
  connection.then(function (db) {
    var email = req.cookies.email;
    const collection = db.db('tutorbuddy').collection('users');
    collection.findOne({
      'email': email
    }, function (err, result) {
      if (err) {
        console.log('error');
        res.redirect('/login');
      } else if (result) {
        console.log('result is valid');
        console.log(result.fName);
        res.render('updateinfoform', {
          page: 'updateinfoform',
          menuId: 'updateinfoform',
          courses: coursesJson,
          areas: courseAreas,
          user: result,
          loggedIn: loggedIn
        });
      } else {
        console.log(result);
        res.redirect('/login');
      }
    });
  });
});

router.get('/dashboard', function (req, res, next) {
  var loggedIn = isLoggedIn(req)
  connection.then(function (db) {
    var email = req.cookies.email;
    const collection = db.db('tutorbuddy').collection('users');
    collection.findOne({
      'email': email
    }, function (err, result) {
      if (err) {
        console.log('error');
        res.redirect('/login');
      } else if (result) {
        console.log('result is valid');
        console.log(result.fName);
        res.render('dashboard', {
          page: 'Dashboard',
          menuId: 'dashboard',
          user: result,
          loggedIn: loggedIn
        });
      } else {
        console.log(result);
        res.redirect('/login');
      }
    });
  });
});

router.get('/findtutor', function (req, res, next) {
  var loggedIn = isLoggedIn(req)
  connection.then(function (db) {
    var email = req.cookies.email;
    const collection = db.db('tutorbuddy').collection('users');
    collection.findOne({
      'email': email
    }, function (err, result) {
      if (err) {
        console.log('error');
        res.redirect('/login');
      } else if (result) {
        console.log('result is valid');
        console.log(result.fName);
        res.render('findTutor', {
          page: 'FindTutor',
          menuId: 'findTutor',
          courses: coursesJson,
          areas: courseAreas,
          user: result,
          loggedIn: loggedIn
        });
      } else {
        console.log(result);
        res.redirect('/login');
      }
    });
  });
});

router.get('/findtutornames', function (req, res, next) {
  var loggedIn = isLoggedIn(req)
  var coursename = req.query.name
  connection.then(function (db) {
    var email = req.cookies.email;
    const collection = db.db('tutorbuddy').collection('users');
    collection.find().toArray(function (err, allInfo) {
      res.render('findTutorNames', {
        page: 'FindTutorNames',
        menuId: 'findTutorNames',
        courses: coursesJson,
        areas: courseAreas,
        name: coursename,
        loggedIn: loggedIn,
        allInfo: allInfo
      });
    });
  });
});

//ADD STUDENT
router.post('/adduser', function (req, res) {
  connection.then(function (db) {
    console.log('Connected to Server');
    const collection = db.db('tutorbuddy').collection('users');
    var student = {
      email: req.body.email,
      fName: req.body.firstName,
      lName: req.body.lastName,
      password: req.body.pass
    };
    collection.insert([student], function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result.ops[0]._id);
        var _id1 = encodeURIComponent(result.ops[0]._id);
        res.redirect('/infoform?_id=' + _id1)
      }
    })
  })
})

//ADD CLASSES
router.post('/addinfo', function (req, res) {
  connection.then(function (db) {
    console.log('Connected to Server');
    const collection = db.db('tutorbuddy').collection('users');
    var url_string = req.headers.referer;
    var split = url_string.split('=');
    var id2 = split[1];
    console.log(id2);
    console.log(req.body.classes);
    var dbdata = {
      '_id': ObjectId(id2)
    }
    var a = [];
    for (var b = 0; b < req.body.honorsocieties.length; b++) {
      a[b] = {
        name: req.body.honorsocieties[b],
        minutes: 0
      }
    }
    var student = {
      $set: {
        classes: req.body.classes,
        times: req.body.times,
        honorsocieties: req.body.honorsocieties,
        totalMinutes: 0,
        hsMinutes: a
      }
    }
    collection.update(dbdata, student, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/dashboard')
      }
    });
  });
});

//UPDATE INFO
router.post('/updateinfo', function (req, res) {
  connection.then(function (db) {
    console.log('Connected to Server');
    const collection = db.db('tutorbuddy').collection('users');
    var email = req.cookies.email;
    console.log(email);
    var dbdata = {
      'email': email
    }
    totalMinutes = parseInt(req.body.totalMinutes);
    var student = {
      $set: {
        classes: req.body.classes,
        times: req.body.times,
        honorsocieties: req.body.honorsocieties,
      }
    }
    collection.update(dbdata, student, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        collection.find({
          'email': email
        }).toArray(function (err, result) {
          var a = [];
          var count = 0;
          for (var b = 0; b < req.body.honorsocieties.length; b++) {
            var isAlreadyIn = false;
            var alreadyHaveMins;
            for (var c = 0; c < result[0].hsMinutes.length; c++){
              if (result[0].hsMinutes[c].name == req.body.honorsocieties[b]){
                isAlreadyIn = true;
                alreadyHaveMins = result[0].hsMinutes[c].minutes;
              }
            }
            if (isAlreadyIn == false){
              a[count] = {
                name: req.body.honorsocieties[b],
                minutes: 0
              }
              count++;
            }
            else if (isAlreadyIn == true){
              a[count] = {
                name: req.body.honorsocieties[b],
                minutes: alreadyHaveMins
              }
              count++;
            }
          }
          var olddata = {
            'email': email
          }
          var newdata = {
            $set: {
              hsMinutes: a
            }
          }
          collection.update(olddata, newdata, {upsert: true}, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              res.redirect('/updateinfoform');
            }
          })
        })
      }
    });
  });
});

//LOGIN
router.post('/authenticateuser', function (req, res) {
  connection.then(function (db) {
    console.log('Connected to Server');
    const collection = db.db('tutorbuddy').collection('users');
    var email = req.body.email;
    var password = req.body.pass;
    collection.find({
      'email': email,
      'password': password
    }).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        res.cookie("email", email);
        console.log('Credentials verified');
        res.redirect('/dashboard');
      } else {
        console.log('Incorrect username or password');
        res.redirect('/login-fail');
      }
    })
  }).catch(err => { // we will not be here...
    console.error('App starting error:', err.stack);
    process.exit(1);
  })
});

//RENDER REQUEST FORM
router.post('/requestform', function (req, res) {
  connection.then(function (db) {
    const collection = db.db('tutorbuddy').collection('users');
    collection.find({
      'email': req.cookies.email
    }).toArray(function (err, result) {
      var tuteeEmail = req.cookies.email;
      var tuteefName = result[0].fName;
      var tuteelName = result[0].lName;
      var tutorEmail = req.body.email;
      var tutorfName = req.body.firstName;
      var tutorlName = req.body.lastName;
      var date = req.body.date;
      var time = req.body.times;
      var subject = req.body.subject;
      console.log('Connected to Server');
      var tutorolddata = {
        'email': tutorEmail
      }
      var tutornewdata = {
        $push: {
          tuteeRequests: {
            email: tuteeEmail,
            fName: tuteefName,
            lName: tuteelName,
            date: date,
            time: time,
            subject: subject
          }
        }
      }
      console.log(req.body.times);
      collection.update(tutorolddata, tutornewdata, function(err, result) {
        if (err){
          console.log(err);
        } else {
          var tuteeolddata = {
            'email': req.cookies.email
          }
          var tuteenewdata = {
            $push: {
              tutors: {
                email: tutorEmail,
                fName: tutorfName,
                lName: tutorlName,
                date: date,
                time: time,
                subject: subject,
                pending: 'true'
              }
            }
          }
          collection.update(tuteeolddata, tuteenewdata, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              // const sgMail = require('@sendgrid/mail');
              // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              // const msg = {
              //   to: tutorEmail,
              //   from: tuteeEmail,
              //   subject: 'New Tutoring Request!',
              //   text: 'New Tutoring Request from: ' + tuteeEmail + '. Please login at sas.tutorbuddy.com and visit the dashboard',
              // };
              // sgMail.send(msg);
              res.redirect('/dashboard');
            }
          })
        }
      })
    })
  })
});

//PROCESS TUTEE REQUESTS

//ACCEPT
router.post('/accepttuteerequest', function (req, res) {
  connection.then(function (db) {
    const collection = db.db('tutorbuddy').collection('users');
    collection.find({
      email: req.cookies.email
    }).toArray(function (err, result) {
      if (err){
        console.log(err);
      } else {
        var olddata = {
          'email': result[0].email
        }
        var newdata = {
          $push: {
            tutees : {
              email: req.body.tuteeemail,
              fName: req.body.tuteefname,
              lName: req.body.tuteelname,
              subject: req.body.tuteesubject,
              time: req.body.tuteetime
            }
          }
        }
        collection.update(olddata, newdata, function (err, result1) {
          if (err) {
            console.log(err);
          } else {
            var deletedata = {
              $pull: {
                tuteeRequests: {
                  email: req.body.tuteeemail
                }
              }
            }
            collection.update(olddata, deletedata, function (err, result2) {
              if (err) {
                console.log(err);
              } else {
                collection.find({
                  'email' : req.body.tuteeemail
                }).toArray(function (err, result3) {
                  if (err){
                    console.log(err);
                  } else {
                    console.log('here');
                    var data1;
                    for (var q = 0; q < result3[0].tutors.length; q++) {
                      if (result3[0].tutors[q].email == result[0].email){
                        data1 = q;
                      }
                    }
                    console.log(data1 + ' is data1');
                    var tuteeolddata = {
                      'email': req.body.tuteeemail
                    }
                    var tuteenewdata = {
                      $set: {
                        [`tutors.${data1}`]: {
                            email: result[0].email,
                            fName: result[0].fName,
                            lName: result[0].lName,
                            subject: req.body.tuteesubject,
                            time: req.body.tuteetime,
                            pending: 'false'
                        }
                      }
                    }
                    collection.update(tuteeolddata, tuteenewdata, function (err, result) {
                      if (err) {
                        console.log(err)
                      } else {
                        res.redirect('/dashboard');
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  })
})

//REJECT
router.post('/rejecttuteerequest', function (req, res) {
  connection.then(function (db) {
    const collection = db.db('tutorbuddy').collection('users');
    collection.find({
      email: req.cookies.email
    }).toArray(function (err, result) {
      if (err){
        console.log(err);
      } else {
        var olddata = {
          'email': result[0].email
        }
        var newdata = {
          $pull: {
            tuteeRequests: {
              email: req.body.tuteeemail
            }
          }
        }
        collection.update(olddata, newdata, function (err, result) {
          if (err){
            console.log(err);
          } else {
            collection.find({
              email: req.body.tuteeemail
            }).toArray(function (err, result) {
              if (err) {
                console.log(err);
              } else {
                var olddata = {
                  'email': result[0].email
                }
                var newdata = {
                  $pull: {
                    tutors: {
                      email: req.cookies.email
                    }
                  }
                }
                collection.update(olddata, newdata, function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.redirect('/dashboard');
                  }
                })
              }
            })
          }
        })
      }
    })
  })
})

//PROCESS TUTEE REQUESTS 1

//ACCEPT 1
router.post('/accepttuteerequest1', function (req, res) {
  connection.then(function (db) {
    const collection = db.db('tutorbuddy').collection('users');
    collection.find({
      email: req.cookies.email
    }).toArray(function (err, result) {
      if (err){
        console.log(err);
      } else {
        var olddata = {
          'email': result[0].email
        }
        var newdata = {
          $push: {
            tutees : {
              email: req.body.tuteeemail1,
              fName: req.body.tuteefname1,
              lName: req.body.tuteelname1,
              subject: req.body.tuteesubject1,
              time: req.body.tuteetime1
            }
          }
        }
        collection.update(olddata, newdata, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            var deletedata = {
              $pull: {
                tuteeRequests: {
                  email: req.body.tuteeemail1
                }
              }
            }
            collection.update(olddata, deletedata, function (err, result2) {
              if (err) {
                console.log(err);
              } else {
                collection.find({
                  'email' : req.body.tuteeemail1
                }).toArray(function (err, result3) {
                  if (err){
                    console.log(err);
                  } else {
                    console.log('here');
                    var data1;
                    for (var q = 0; q < result3[0].tutors.length; q++) {
                      if (result3[0].tutors[q].email == result[0].email){
                        data1 = q;
                      }
                    }
                    console.log(data1 + ' is data1');
                    var tuteeolddata = {
                      'email': req.body.tuteeemail1
                    }
                    var tuteenewdata = {
                      $set: {
                        [`tutors.${data1}`]: {
                          email: result[0].email,
                          fName: result[0].fName,
                          lName: result[0].lName,
                          subject: req.body.tuteesubject1,
                          time: req.body.tuteetime1,
                          pending: 'false'
                        }
                      }
                    }
                    collection.update(tuteeolddata, tuteenewdata, function (err, result) {
                      if (err) {
                        console.log(err)
                      } else {
                        res.redirect('/dashboard');
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  })
})

//REJECT 1
router.post('/rejecttuteerequest1', function (req, res) {
  connection.then(function (db) {
    const collection = db.db('tutorbuddy').collection('users');
    collection.find({
      email: req.cookies.email
    }).toArray(function (err, result) {
      if (err){
        console.log(err);
      } else {
        var olddata = {
          'email': result[0].email
        }
        var newdata = {
          $pull: {
            tuteeRequests: {
              email: req.body.tuteeemail1,
              subject: req.body.tuteesubject1
            }
          }
        }
        collection.update(olddata, newdata, function (err, result) {
          if (err){
            console.log(err);
          } else {
            res.redirect('/dashboard');
          }
        })
      }
    })
  })
})

//DELETE TUTEE
router.post('/deletetutee', function (req, res){
  connection.then(function (db) {
    const collection = db.db('tutorbuddy').collection('users');
    collection.find({
      email: req.cookies.email
    }).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        var olddata = {
          'email': result[0].email
        }
        var tuteeIndex;
        for (var i = 0; i < result[0].tutees.length; i++) {
          if (result[0].tutees[i].email == req.body.tuteeEmail){
            tuteeIndex = i;
          }
        }
        var newdata = {
          $unset: {
            [`tutees.${tuteeIndex}`]: 1
          }
        }
        collection.update(olddata, newdata, function (err, result1) {
          if (err) {
            console.log(err);
          } else {
            var olddata1 = {
              'email': result[0].email
            }
            var newdata1 = {
              $pull: {
                tutees: null
              }
            }
            collection.update(olddata1, newdata1, function (err, result2) {
              if (err) {
                console.log(err);
              } else {
                collection.find({
                  email: req.body.tuteeEmail
                }).toArray(function (err, result3) {
                  if (err) {
                    console.log(err);
                  } else {
                    var olddata2 = {
                      'email': result3[0].email
                    }
                    var tutorIndex;
                    for (var i = 0; i < result3[0].tutors.length; i++) {
                      if (result3[0].tutors[i].email == req.cookies.email){
                        tutorIndex = i;
                      }
                    }
                    var newdata2 = {
                      $unset: {
                        [`tutors.${tutorIndex}`]: 1
                      }
                    }
                    collection.update(olddata2, newdata2, function (err, result4) {
                      if (err) {
                        console.log(err);
                      } else {
                        var olddata3 = {
                          'email': result3[0].email
                        }
                        var newdata3 = {
                          $pull: {
                            tutors: null
                          }
                        }
                        collection.update(olddata3, newdata3, function (err, result5) {
                          if (err) {
                            console.log(err);
                          } else {
                            res.redirect('/dashboard');
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  })
})

//DELETE TUTOR
router.post('/deletetutor', function (req, res){
  connection.then(function (db) {
    const collection = db.db('tutorbuddy').collection('users');
    collection.find({
      email: req.cookies.email
    }).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('this passed');
        var olddata = {
          'email': result[0].email
        }
        var tutorIndex;
        for (var i = 0; i < result[0].tutors.length; i++) {
          if (result[0].tutors[i].email == req.body.tutorEmail){
            tutorIndex = i;
          }
        }
        var newdata = {
          $unset: {
            [`tutors.${tutorIndex}`]: 1
          }
        }
        collection.update(olddata, newdata, function (err, result1) {
          if (err) {
            console.log(err);
          } else {
            var olddata1 = {
              'email': result[0].email
            }
            var newdata1 = {
              $pull: {
                tutors: null
              }
            }
            collection.update(olddata1, newdata1, function (err, result2) {
              if (err) {
                console.log(err);
              } else {
                collection.find({
                  email: req.body.tutorEmail
                }).toArray(function (err, result3) {
                  if (err) {
                    console.log(err);
                  } else {
                    var olddata2 = {
                      'email': result3[0].email
                    }
                    var tuteeIndex;
                    for (var i = 0; i < result3[0].tutees.length; i++) {
                      if (result3[0].tutees[i].email == req.cookies.email){
                        tuteeIndex = i;
                      }
                    }
                    var newdata2 = {
                      $unset: {
                        [`tutees.${tuteeIndex}`]: 1
                      }
                    }
                    collection.update(olddata2, newdata2, function (err, result4) {
                      if (err) {
                        console.log(err);
                      } else {
                        var olddata3 = {
                          'email': result3[0].email
                        }
                        var newdata3 = {
                          $pull: {
                            tutees: null
                          }
                        }
                        collection.update(olddata3, newdata3, function (err, result5) {
                          if (err) {
                            console.log(err);
                          } else {
                            res.redirect('/dashboard');
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  })
})

//ADDHOURS

router.post('/addhours', function (req, res) {
  connection.then(function (db) {
    const collection = db.db('tutorbuddy').collection('users');
    collection.find({
      email: req.body.tutorEmail
    }).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        var olddata = {
          'email': result[0].email
        }
        console.log(result[0].totalMinutes);
        total = parseInt(req.body.duration);
        var add = result[0].totalMinutes + total;
        var newdata = {
          $set: {
            totalMinutes: add
          }
        }
        collection.update(olddata, newdata, function (err, result2) {
          if (err) {
            console.log(err);
          } else {
            collection.find({
              'email': req.body.tutorEmail
            }).toArray(function (err, result) {
              if (err) {
                console.log(err);
              } else {
                var olddata1 = {
                  'email': result[0].email
                }
                if (req.body.forNHS == 'on'){
                  var index1;
                  for (var k = 0; k < result[0].hsMinutes.length; k++){
                    if (result[0].hsMinutes[k].name == 'National Honor Society'){
                      index1 = k;
                    }
                  }
                  console.log(index1 + ' is index1');
                  add2 = parseInt(req.body.duration);
                  console.log(result[0].hsMinutes[index1].minutes + ' this is here');
                  var newMinutes = result[0].hsMinutes[index1].minutes + add2
                  var newdata1 = {
                    $set: {
                      [`hsMinutes.${index1}`]: {
                        name: result[0].hsMinutes[index1].name,
                        minutes: newMinutes
                      }
                    }
                  }
                }
                else {
                  console.log(req.body.tutorEmail);
                  var sub;
                  for (var i = 0; i < courseAreas.length; i++){
                    for (var j = 0; j < coursesJson[courseAreas[i]].length; j++){
                      if (coursesJson[courseAreas[i]][j] == req.body.subject){
                        sub = courseAreas[i];
                      }
                    }
                  }
                  console.log('sub is: ' + sub);
                  var newdata1;
                  if (sub == 'Mathematics'){
                    var index1;
                    for (var k = 0; k < result[0].hsMinutes.length; k++){
                      if (result[0].hsMinutes[k].name == 'Mu Alpha Theta'){
                        index1 = k;
                      }
                    }
                    console.log(index1);
                    add2 = parseInt(req.body.duration);
                    var newMinutes = result[0].hsMinutes[index1].minutes + add2
                    newdata1 = {
                      $set: {
                        [`hsMinutes.${index1}`]: {
                          name: result[0].hsMinutes[index1].name,
                          minutes: newMinutes
                        }
                      }
                    }
                  }
                  if (sub == 'Science'){
                    if (req.body.subject == 'AP Computer Science' || req.body.subject == 'AT Computer Science'){
                      var index1;
                      for (var k = 0; k < result[0].hsMinutes.length; k++){
                        if (result[0].hsMinutes[k].name == 'Computer Science National Honor Society'){
                          index1 = k;
                        }
                      }
                      console.log(index1);
                      add2 = parseInt(req.body.duration);
                      var newMinutes = result[0].hsMinutes[index1].minutes + add2
                      newdata1 = {
                        $set: {
                          [`hsMinutes.${index1}`]: {
                            name: result[0].hsMinutes[index1].name,
                            minutes: newMinutes
                          }
                        }
                      }
                    }
                    else {
                      var index1;
                      for (var k = 0; k < result[0].hsMinutes.length; k++){
                        if (result[0].hsMinutes[k].name == 'Science National Honor Society'){
                          index1 = k;
                        }
                      }
                      console.log(index1);
                      add2 = parseInt(req.body.duration);
                      var newMinutes = result[0].hsMinutes[index1].minutes + add2
                      newdata1 = {
                        $set: {
                          [`hsMinutes.${index1}`]: {
                            name: result[0].hsMinutes[index1].name,
                            minutes: newMinutes
                          }
                        }
                      }
                    }
                  }
                  if (sub == 'Arts'){
                    var index1;
                    for (var k = 0; k < result[0].hsMinutes.length; k++){
                      if (result[0].hsMinutes[k].name == 'National Arts Honor Society'){
                        index1 = k;
                      }
                    }
                    console.log(index1);
                    add2 = parseInt(req.body.duration);
                    var newMinutes = result[0].hsMinutes[index1].minutes + add2
                    newdata1 = {
                      $set: {
                        [`hsMinutes.${index1}`]: {
                          name: result[0].hsMinutes[index1].name,
                          minutes: newMinutes
                        }
                      }
                    }
                  }
                  if (sub == 'Social Studies'){
                    var index1;
                    for (var k = 0; k < result[0].hsMinutes.length; k++){
                      if (result[0].hsMinutes[k].name == 'Social Studies Honor Society'){
                        index1 = k;
                      }
                    }
                    console.log(index1);
                    add2 = parseInt(req.body.duration);
                    var newMinutes = result[0].hsMinutes[index1].minutes + add2
                    newdata1 = {
                      $set: {
                        [`hsMinutes.${index1}`]: {
                          name: result[0].hsMinutes[index1].name,
                          minutes: newMinutes
                        }
                      }
                    }
                  }
                  if (sub == 'Chinese'){
                    var index1;
                    for (var k = 0; k < result[0].hsMinutes.length; k++){
                      if (result[0].hsMinutes[k].name == 'Chinese Honor Society'){
                        index1 = k;
                      }
                    }
                    console.log(index1);
                    add2 = parseInt(req.body.duration);
                    var newMinutes = result[0].hsMinutes[index1].minutes + add2
                    newdata1 = {
                      $set: {
                        [`hsMinutes.${index1}`]: {
                          name: result[0].hsMinutes[index1].name,
                          minutes: newMinutes
                        }
                      }
                    }
                  }
                  if (sub == 'French'){
                    var index1;
                    for (var k = 0; k < result[0].hsMinutes.length; k++){
                      if (result[0].hsMinutes[k].name == 'French Honor Society'){
                        index1 = k;
                      }
                    }
                    console.log(index1);
                    add2 = parseInt(req.body.duration);
                    var newMinutes = result[0].hsMinutes[index1].minutes + add2
                    newdata1 = {
                      $set: {
                        [`hsMinutes.${index1}`]: {
                          name: result[0].hsMinutes[index1].name,
                          minutes: newMinutes
                        }
                      }
                    }
                  }
                  if (sub == 'Spanish'){
                    var index1;
                    for (var k = 0; k < result[0].hsMinutes.length; k++){
                      if (result[0].hsMinutes[k].name == 'Spanish Honor Society'){
                        index1 = k;
                      }
                    }
                    console.log(index1);
                    add2 = parseInt(req.body.duration);
                    var newMinutes = result[0].hsMinutes[index1].minutes + add2
                    newdata1 = {
                      $set: {
                        [`hsMinutes.${index1}`]: {
                          name: result[0].hsMinutes[index1].name,
                          minutes: newMinutes
                        }
                      }
                    }
                  }
                  if (sub == 'English'){
                    var index1;
                    for (var k = 0; k < result[0].hsMinutes.length; k++){
                      if (result[0].hsMinutes[k].name == 'English Honor Society'){
                        index1 = k;
                      }
                    }
                    console.log(index1);
                    add2 = parseInt(req.body.duration);
                    var newMinutes = result[0].hsMinutes[index1].minutes + add2
                    newdata1 = {
                      $set: {
                        [`hsMinutes.${index1}`]: {
                          name: result[0].hsMinutes[index1].name,
                          minutes: newMinutes
                        }
                      }
                    }
                  }
                }
                collection.update(olddata1, newdata1, function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    collection.find({
                      email: req.cookies.email
                    }).toArray(function (err, result3) {
                      if (err) {
                        console.log(err);
                      } else {
                        var olddata2 = {
                          'email': result3[0].email
                        }
                        console.log(result3[0].email);
                        var tutorIndex;
                        for (var i = 0; i < result3[0].tutors.length; i++) {
                          if (result3[0].tutors[i].email == req.body.tutorEmail){
                            tutorIndex = i;
                          }
                        }
                        var newdata2 = {
                          $unset: {
                            [`tutors.${tutorIndex}`]: 1
                          }
                        }
                        collection.update(olddata2, newdata2, function (err, result4) {
                          if (err) {
                            console.log(err);
                          } else {
                            var olddata3 = {
                              'email': result3[0].email
                            }
                            var newdata3 = {
                              $pull: {
                                tutors: null
                              }
                            }
                            collection.update(olddata3, newdata3, function (err, result5) {
                              if (err) {
                                console.log(err);
                              } else {
                                res.redirect('/dashboard');
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  })
})

//LOGOUT
router.get('/logout', function (req, res) {
  res.clearCookie("email");
  res.redirect('/login');
})
module.exports = router;
