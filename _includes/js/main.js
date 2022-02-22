(function () {
    "use strict";

    $(function () {
        var leapp = {
            elements: {
                html: $("html"),
                hamburger: $("#hamburger"),
                navigation: $("#navigation"),
                accordion: $(".accordion"),
                twSlider: $('#tweetSlider'),
                navAnchor: $("#navigation .anchor"),
                supportForm: $("#support-form"),
                contactsForm: $("#contacts-form"),
                releases: $("#releases-content"),
                downloadWrapper: $("#download-wrapper"),
                downloadAction: $("#download-action"),
                downloadContent: $("#download-content"),
                downloadLabel: $("#download-label"),
                cfDistribution: "https://asset.noovolari.com",
                gitHubReleases: "https://github.com/Noovolari/leapp/releases/",
                steps: $(".steps-navigation a")
            },
            init: function () {

                this._hamburger();
                this._slick();
                this._anchor();
                this._accordion();
                this._steps();
                this._githubStats();
                this._formValidate();
                if (this.elements.releases.length > 0) {
                    this._releases();
                }

            },
            _githubStats: function () {
                $.getJSON("https://api.github.com/search/issues?q=repo:Noovolari/leapp%20is:issue", (data) => {
                    const issues = data.total_count;
                    $('#issues').html(issues);
                });
                $.getJSON("https://api.github.com/orgs/Noovolari/repos", (data) => {
                   $(data).each((i, repo) => {
                       if(repo.name === "leapp") {
                           const stars = repo.stargazers_count;
                           $('#stars').html(stars);
                       }
                   });
                });
            },
            _hamburger: function () {
                var _self = this;
                _self.elements.hamburger.on("click", function () {
                    _self.elements.navigation.slideToggle(200, "linear");
                    _self.elements.html.toggleClass("noscroll");
                });
            },
            _download: function () {
                var _self = this;

                $.ajax({
                    type: 'GET',
                    url: _self.elements.cfDistribution + "/latest/latest.yml",
                    success: function (response) {
                        var version = response.split("\n")[0].substring(9);

                        var content = "";
                        var platform = navigator.platform.toLowerCase();
                        var urlWin = _self.elements.cfDistribution + '/latest/Leapp-' + version + '-win.zip';
                        var urlMac = _self.elements.cfDistribution + '/latest/Leapp-' + version + '-mac.zip';
                        var urlLin = _self.elements.cfDistribution + '/latest/Leapp_' + version + '_amd64.deb';
                        var urlLinAppImage = _self.elements.cfDistribution + '/latest/Leapp-' + version + '.AppImage';

                        if (platform.indexOf('win') !== -1) {
                            content = '<a href="' + urlWin + '" class="download">Download Windows</a>';
                        } else if (platform.indexOf('mac') !== -1) {
                            content += '<a href="' + urlMac + '" class="download">Download MacOs</a>';
                        } else if (platform.indexOf('linux') !== -1) {
                            content = '<a href="' + urlLin + '" class="download">Download Linux</a>' +
                                      '';
                        } else {
                            content = '<a href="' + _self.elements.gitHubReleases + '">Download latest</a>';
                        }

                        _self.elements.downloadContent.find('a[data-os="mac"]').attr("href", urlMac);
                        _self.elements.downloadContent.find('a[data-os="win"]').attr("href", urlWin);
                        _self.elements.downloadContent.find('a[data-os="linux"]').attr("href", urlLin);
                        _self.elements.downloadContent.find('a[data-os="linAppImage"]').attr("href", urlLinAppImage);

                        _self.elements.downloadLabel.html(content);

                        _self.elements.downloadWrapper.fadeIn("fast", function () {
                            _self.elements.downloadAction.on("click", function () {
                                _self.elements.downloadContent.slideToggle('fast');
                            });
                        });
                    }
                });
            },
            _slick: function () {
                this.elements.twSlider.slick({
                    dots: true,
                    arrows: true,
                    infinite: false,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    prevArrow: "<i class='slick-prev pull-left fas fa-chevron-left'></i>",
                    nextArrow: "<i class='slick-next pull-right fas fa-chevron-right'></i>",
                    responsive: [{
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                                infinite: true,
                                dots: true,
                                arrows: true
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                dots: true,
                                arrows: true
                            }
                        }
                    ]
                });
            },
            _scrollTo: function (pos) {
                $('html, body').animate({
                    scrollTop: pos
                }, {
                    duration: "slow",
                    easing: "linear"
                });
            },
            _anchor: function () {
                var _self = this;
                var hash = $(location).attr('hash');

                if (hash) {
                    window.scrollTo(0, 0);
                }
            },
            _steps: function () {
                var _self = this;
                this.elements.steps.on("click", function (e) {
                    e.preventDefault();
                    var elm = $(this).attr("href");
                    var lastElmPos = $(elm).position().top - $("#navbar-container").outerHeight();
                    _self._scrollTo(lastElmPos);
                });
            },
            _accordion: function () {
                this.elements.accordion.on("click", ".accordion-header", function () {
                    var cta = $(this).find(".accordion-cta");
                    cta.toggleClass("fa-plus").toggleClass("fa-minus");
                    cta.closest("li").find(".accordion-content").slideToggle(200, "linear");
                });
            },
            _formValidate: function () {

                var _self = this;

                var el = document.getElementById('g-recaptcha-response');
                if (el) {
                    el.setAttribute('required', 'required');
                }

                if (this.elements.supportForm.length > 0) {
                    var form = document.getElementById("support-form");
                    this.elements.supportForm.validate({
                        ignore: [],
                        rules: {
                            support_name: {
                                required: true
                            },
                            support_email: {
                                required: true,
                                email: true
                            },
                            support_company: {
                                required: true
                            },
                            support_cloud: {
                                required: true
                            },
                            "g-recaptcha-response": {
                                required: true
                            }
                        },
                        messages: {
                            support_name: "Please provide your name",
                            support_email: "Please enter a valid email.",
                            support_company: "Please provide your company.",
                            support_size: "Please select your company size.",
                            support_cloud: "Please select your cloud."
                        },
                        errorElement: "div",
                        errorPlacement: function (error, element) {
                            element.before(error);
                        },
                        submitHandler: function () {
                            submitForm(form);
                        }
                    });
                }
                if (this.elements.contactsForm.length > 0) {
                    var form = document.getElementById("contacts-form");
                    this.elements.contactsForm.validate({
                        ignore: [],
                        rules: {
                            contacts_name: {
                                required: true
                            },
                            contacts_email: {
                                required: true,
                                email: true
                            },
                            contacts_message: {
                                required: true
                            },
                            "g-recaptcha-response": {
                                required: true
                            }
                        },
                        messages: {
                            contacts_name: "Please provide your name",
                            contacts_email: "Please enter a valid email.",
                            contacts_message: "Please provide your message."
                        },
                        errorElement: "div",
                        errorPlacement: function (error, element) {
                            element.before(error);
                        },
                        submitHandler: function () {
                            submitForm(form);
                        }
                    });
                }

                /* Formspree integration */
                async function submitForm(fm) {
                    var jqForm = $(fm);
                    var method = jqForm.attr("method");
                    var action = jqForm.attr("action");
                    var status = $("#leapp-form-status");
                    var data = new FormData(fm);
                    var formPos = jqForm.position().top - $("#navbar-container").outerHeight();
                    fetch(action, {
                        method: method,
                        body: data,
                        headers: {
                            'Accept': 'application/json'
                        }
                    }).then(response => {
                        _self._scrollTo(formPos);
                        jqForm.fadeOut("fast");
                        form.reset();
                        grecaptcha.reset();
                        status.fadeIn("fast").html("Thanks for your submission!");
                    }).catch(error => {
                        _self._scrollTo(formPos);
                        jqForm.fadeOut();
                        form.reset();
                        status.fadeIn("fast").html("<span class='error'> Oops! There was a problem submitting your form.</span>");
                    });
                    setTimeout(function () {
                        status.fadeOut("fast").html("");
                        jqForm.fadeIn("fast");
                    }, 5000);
                }

            },
            _releases: function () {

                var _self = this;

                $.ajax({
                    type: "GET",
                    url: _self.elements.cfDistribution + "/CHANGELOG.md",
                    success: function (response) {

                        var rawVersion = "0.0.0";
                        var index = 1;
                        var downloadListCounter = 1;
                        var versionNumber = 0;
                        var hide = false;
                        var latestVersion = 0;

                        var renderer = new marked.Renderer();

                        renderer.heading = function (text, level, raw) {
                            if (!hide) {
                                var version = text.replace(/[\(\[].*?[\)\]]/g, '').replace("\">", "\">v");

                                versionNumber = parseInt(rawVersion.replace(/\./g, '').trim());

                                if (versionNumber === 50) {
                                    hide = true;
                                }
                                if (level === 1)
                                    return '<h1>Changelog</h1>';
                                else if (text.indexOf("Feat") > -1 | text.indexOf("Bug") > -1)
                                    return '<h' + level + ' class="italic">' + version + '</h' + level + '>';
                                else {
                                    var context = "",
                                        prefix = "";
                                    rawVersion = raw.replace(/[\(\[].*?[\)\]]/g, '').trim();
                                    if (text.indexOf("href") === -1) {
                                        context = " class='nolink'";
                                        prefix = "v ";
                                    }
                                    downloadListCounter = 1;

                                    if (versionNumber === 0) {
                                        latestVersion = rawVersion;
                                    }

                                    return '</div><h' + level + context + '>' + prefix + version + '</h' + level + '><div class="release-wrapper" id="rw' + versionNumber + '">';
                                }
                            } else {
                                return "";
                            }

                        };
                        renderer.list = function (body) {
                            if (!hide) {
                                /*var folder = index === 1? "latest" : rawVersion.trim();*/
                                var folder = latestVersion === rawVersion ? "latest" : rawVersion.trim();

                                versionNumber = parseInt(rawVersion.replace(/\./g, '').trim());

                                var generatedDownloadURL = '<ul class="default-list">' + body + '</ul>';
                                generatedDownloadURL += '<ul class="download-list">';
                                generatedDownloadURL += '<li><a href="' + _self.elements.cfDistribution + '/' + folder + '/Leapp-' + rawVersion + '-win.zip" data-os="win" data-version="' + rawVersion + '" class="download"><i class="fab fa-windows"></i> Download</a></li>';
                                generatedDownloadURL += '<li><a href="' + _self.elements.cfDistribution + '/' + folder + '/Leapp-' + rawVersion + '-mac.zip" data-os="mac" data-version="' + rawVersion + '" class="download"><i class="fab fa-apple"></i> Download</a></li>';
                                generatedDownloadURL += '<li><a href="' + _self.elements.cfDistribution + '/' + folder + '/Leapp_' + rawVersion + '_amd64.deb" data-os="linux" data-version="' + rawVersion + '" class="download"><i class="fab fa-linux"></i> Download .deb</a></li>';
                                generatedDownloadURL += '<li><a href="' + _self.elements.cfDistribution + '/' + folder + '/Leapp-' + rawVersion + '.AppImage" data-os="linux" data-version="' + rawVersion + '" class="download"><i class="fab fa-linux"></i> Download .AppImage</a></li>';
                                generatedDownloadURL += '</ul>';

                                /* if (downloadListCounter > 1) {
                                    console.log(body);
                                } */

                                index++;
                                downloadListCounter++;

                                var allVersion = "<a href='" + _self.elements.gitHubReleases + "' class='d-block mb-2' target='_blank' rel='noopener'>View all versions</a>";
                                if (versionNumber == 51)
                                    return generatedDownloadURL + "" + allVersion;
                                else
                                    return generatedDownloadURL;
                            } else {
                                return "";
                            }
                        };

                        var responseMD = marked(response, {
                            renderer: renderer,
                            headerIds: false
                        });

                        _self.elements.releases.html(responseMD);

                        /* Hide first download list when more than one */
                        $(".release-wrapper").filter(
                                function () {
                                    return $(this).children(".download-list").length > 1;
                                })
                            .children(".download-list:not(:last-of-type)").hide();

                    }
                });
            }
        };

        leapp.init();
    });

})();
