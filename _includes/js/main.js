(function () {
    "use strict";
    var globalInterval;
    var globalIntervalTerminal;
    var steps = [];
    var autoPlay = [];

    window.leapp = {
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
            pluginPath: "/plugins",
            cfDistribution: "https://asset.noovolari.com",
            gitHubReleases: "https://github.com/Noovolari/leapp/releases/",
            pluginURL: "https://d4ekrqc4eg.execute-api.eu-west-1.amazonaws.com/api/list-plugin",
            steps: $(".steps-navigation a"),
            listWrapper: $("#listwrapper"),
            terminalCommand: $(".terminal-command"),
            modal: $(".modal")
        },
        init: function () {
            this._navigation();
            this._hamburger();
            this._slick();
            this._anchor();
            this._accordion();
            this._steps();
            this._formValidate();
            if(window.location.pathname === this.elements.pluginPath) {
                this._listPlugin();
            }
            if (this.elements.releases.length > 0) {
                this._releases();
            }
            this._terminalAnimation();
            this._autoPlay();
            this._githubStats();
            if (this.elements.modal.length > 0) {
                this._modal();
            }
            this._typingTheHappens();
        },
        sendEvent: function (action, element, event) {
            if (action.indexOf('Download-From') > -1) {
                gtag('event', 'click.event', {
                    'event_category': 'Download Leapp',
                    'event_label': action,
                    'value': 1,
                    'nonInteraction': false
                });
            } else {
                var videoTitle = $(element).data('title');
                if (dataLayer && videoTitle) {
                    if (action !== 'Progress') {
                        dataLayer.push({
                            'event': 'main_video.event',
                            'eventInfo': {
                                'category': 'Video',
                                'action': action,
                                'label': element,
                                'value': 0,
                                'nonInteraction': false
                            }
                        });
                        gtag('event', 'main_video.event', {
                            'event_category': 'Video',
                            'event_label': action,
                            'value': 0,
                            'nonInteraction': false
                        });
                    } else {
                        var totalLength = element.duration % 60;
                        var percentageCompleted = (element.currentTime / totalLength) * 100;
                        if (percentageCompleted >= 50 && !leapp.reached50) {
                            leapp.reached50 = true;
                            dataLayer.push({
                                'event': 'main_video.event',
                                'eventInfo': {
                                    'category': 'Video',
                                    'action': action,
                                    'label': element,
                                    'value': 50,
                                    'nonInteraction': false
                                }
                            });
                            gtag('event', 'main_video.event', {
                                'event_category': 'Video',
                                'event_label': action,
                                'value': 50,
                                'nonInteraction': false
                            });
                        } else if (percentageCompleted >= 75 && !leapp.reached75) {
                            leapp.reached75 = true;
                            dataLayer.push({
                                'event': 'main_video.event',
                                'eventInfo': {
                                    'category': 'Video',
                                    'action': action,
                                    'label': element,
                                    'value': 75,
                                    'nonInteraction': false
                                }
                            });
                            gtag('event', 'main_video.event', {
                                'event_category': 'Video',
                                'event_label': action,
                                'value': 75,
                                'nonInteraction': false
                            });
                        } else if (percentageCompleted >= 100 && !leapp.reached100) {
                            leapp.reached100 = true;
                            dataLayer.push({
                                'event': 'main_video.event',
                                'eventInfo': {
                                    'category': 'Video',
                                    'action': action,
                                    'label': element,
                                    'value': 100,
                                    'nonInteraction': false
                                }
                            });
                            gtag('event', 'main_video.event', {
                                'event_category': 'Video',
                                'event_label': action,
                                'value': 100,
                                'nonInteraction': false
                            });
                        }
                    }
                }
            }
        },
        _githubStats: function () {
            $.getJSON("https://api.github.com/search/issues?q=repo:Noovolari/leapp%20is:issue", (data) => {
                const issues = data.total_count;
                $('#issues').html(issues);
            });
            $.getJSON("https://api.github.com/orgs/Noovolari/repos", (data) => {
                $(data).each((i, repo) => {
                    if (repo.name === "leapp") {
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
        _navigation: function () {
            this.elements.navigation.find("li").on({
                mouseenter: function () {
                    $(this).find(".submenu-wrapper").removeClass("d-none");
                },
                mouseleave: function () {
                    $(this).find(".submenu-wrapper").addClass("d-none");
                }
            });
        },
        _download: function () {
            var _self = this;

            $.ajax({
                type: 'GET',
                url: _self.elements.cfDistribution + "/latest/latest.yml",
                success: function (response) {
                    var version = response.xsplit("\n")[0].substring(9);

                    var content = "";
                    var platform = navigator.platform.toLowerCase();
                    var urlWin = _self.elements.cfDistribution + '/latest/Leapp-' + version + '-win.zip';
                    var urlMac = _self.elements.cfDistribution + '/latest/Leapp-' + version + '-mac.zip';
                    var urlLin = _self.elements.cfDistribution + '/latest/Leapp_' + version + '_amd64.deb';
                    var urlLinAppImage = _self.elements.cfDistribution + '/latest/Leapp-' + version + '.AppImage';

                    var urlMacM1 = _self.elements.cfDistribution + '/latest/Leapp-' + version + '-mac-arm64.zip';

                    if (platform.indexOf('win') !== -1) {
                        content = '<a href="' + urlWin + '" class="download">Download Windows</a>';
                    } else if (platform.indexOf('mac') !== -1) {
                        content += '<a href="' + urlMac + '" class="download">Download MacOs x64</a>';
                        if (parseInt(version.split(".")[0]) >= 1 || parseInt(version.split(".")[1]) >= 11) {
                            content += '<a href="' + urlMacM1 + '" class="download">Download MacOs arm64</a>';
                        }
                    } else if (platform.indexOf('linux') !== -1) {
                        content = '<a href="' + urlLin + '" class="download">Download Linux</a>' +
                            '';
                    } else {
                        content = '<a href="' + _self.elements.gitHubReleases + '">Download latest</a>';
                    }

                    _self.elements.downloadContent.find('a[data-os="mac"]').attr("href", urlMac);
                    if (parseInt(version.split(".")[0]) >= 1 || parseInt(version.split(".")[1]) >= 11) {
                        _self.elements.downloadContent.find('a[data-os="macM1"]').attr("href", urlMacM1);
                    }
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
                            var versionDate = '';
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
                                versionDate = text.substring(text.indexOf('(') + 1, text.indexOf('(') + 11);
                                if (text.indexOf("href") === -1) {
                                    context = " class='nolink'";
                                    prefix = "v ";
                                }
                                downloadListCounter = 1;

                                if (versionNumber === 0) {
                                    latestVersion = rawVersion;
                                }
                                return `</div><h${level}${context}>${prefix}${version}</h${level}${context}>&nbsp;<small>(${versionDate})</small><div class="release-wrapper" id="rw${versionNumber}">`;
                            }
                        } else {
                            return "";
                        }

                    };
                    renderer.list = function (body) {
                        if (!hide) {
                            var folder = latestVersion === rawVersion ? "latest" : rawVersion.trim();

                            versionNumber = parseInt(rawVersion.replace(/\./g, '').trim());

                            var generatedDownloadURL = '<ul class="default-list">' + body + '</ul>';
                            generatedDownloadURL += '<ul class="download-list">';
                            generatedDownloadURL += '<li><a href="' + _self.elements.cfDistribution + '/' + folder + '/Leapp-' + rawVersion + '-win.zip" data-os="win" data-version="' + rawVersion + '" class="download"><i class="fab fa-windows"></i> Download</a></li>';
                            generatedDownloadURL += '<li><a href="' + _self.elements.cfDistribution + '/' + folder + '/Leapp-' + rawVersion + '-mac.zip" data-os="mac" data-version="' + rawVersion + '" class="download"><i class="fab fa-apple"></i> Download x64</a></li>';
                            if (parseInt(rawVersion.split(".")[0]) >= 1 || parseInt(rawVersion.split(".")[1]) >= 11) {
                                generatedDownloadURL += '<li><a href="' + _self.elements.cfDistribution + '/' + folder + '/Leapp-' + rawVersion + '-mac-arm64.zip" data-os="mac" data-version="' + rawVersion + '" class="download"><i class="fab fa-apple"></i> Download arm64</a></li>';
                            }
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
        },
        _terminalAnimation: function () {

            var keystrokeDelay = 50;

            this.elements.terminalCommand.on('click autoplay-event', function (e) {
                e.preventDefault();
                clearInterval(globalInterval);
                clearInterval(globalIntervalTerminal);
                steps.forEach(step => clearInterval(step));
                if (e.type === 'click') {
                    autoPlay.forEach(autoCommand => clearInterval(autoCommand));
                }
                $('#command-name').text(jQuery(this.children[0]).text());
                $('#command-description').text(jQuery(this.children[1]).text());
                var el = document.querySelector('#command-name');
                showCommand(e);
                typeAnimate(el, 'header', e.currentTarget.innerText);
                var commandSelect = e.currentTarget.children[0].className;
                if (commandSelect === 'leapp-start') {
                    commandAnimateStart(e);
                } else if (commandSelect === 'leapp-stop') {
                    commandAnimateStop(e);
                } else if (commandSelect === 'leapp-sync') {
                    commandAnimateSync(e);
                } else if (commandSelect === 'leapp-generate') {
                    commandAnimateGenerate(e);
                }
            });

            function typeAnimate(el, context, originalText) {
                el.textContent = originalText;
                var chars = el.textContent.split('');
                el.textContent = '';
                var typeIndex = 1;
                if (context === 'header') {
                    globalInterval = setInterval(function () {
                        el.textContent = chars.slice(0, typeIndex++).join('');
                        if (typeIndex > chars.length) {
                            clearInterval(globalInterval);
                            globalInterval = null;
                        }
                    }, keystrokeDelay);
                } else if (context === 'terminal') {
                    globalIntervalTerminal = setInterval(function () {
                        el.textContent = chars.slice(0, typeIndex++).join('');
                        if (typeIndex > chars.length) {
                            clearInterval(globalIntervalTerminal);
                            globalIntervalTerminal = null;
                        }
                    }, keystrokeDelay);
                }
            }

            function commandAnimateStart(e) {
                var commandId = e.currentTarget.children[0].className;
                var c = document.querySelectorAll('.command-container.' + commandId);
                var root = c[0];
                root.children[3].classList.add('hidden-body');
                root.children[4].classList.add('hidden-body');
                root.children[3].children[2].innerHTML = '❯ AWS-federated-session';
                root.children[3].children[2].classList.add('cli-selected');
                root.children[3].children[4].innerHTML = '&nbsp;&nbsp;iam-role-session';
                root.children[3].children[4].classList.remove('cli-selected');
                root.children[3].children[6].innerHTML = '&nbsp;&nbsp;noovolari-sso-1';
                root.children[3].children[6].classList.remove('cli-selected');
                root.children[4].children[5].classList.add('hidden-body');

                typeAnimate(root.children[1], 'terminal', e.currentTarget.innerText);
                steps[0] = setTimeout(function () {
                    root.children[3].classList.remove('hidden-body');
                }, 1400);
                steps[1] = setTimeout(function () {
                    root.children[3].children[2].innerHTML = '&nbsp;&nbsp;AWS-federated-session';
                    root.children[3].children[2].classList.remove('cli-selected');
                    root.children[3].children[4].innerHTML = '❯ iam-role-session';
                    root.children[3].children[4].classList.add('cli-selected');
                }, 2000);
                steps[2] = setTimeout(function () {
                    root.children[3].children[4].innerHTML = '&nbsp;&nbsp;iam-role-session';
                    root.children[3].children[4].classList.remove('cli-selected');
                    root.children[3].children[6].innerHTML = '❯ noovolari-sso-1';
                    root.children[3].children[6].classList.add('cli-selected');
                }, 2500);
                steps[3] = setTimeout(function () {
                    root.children[3].classList.add('hidden-body');
                    root.children[4].classList.remove('hidden-body');
                }, 3300);
                steps[4] = setTimeout(function () {
                    root.children[4].children[5].classList.remove('hidden-body');
                }, 3800);
            }

            function commandAnimateStop(e) {
                var commandId = e.currentTarget.children[0].className;
                var c = document.querySelectorAll('.command-container.' + commandId);
                var root = c[0];
                root.children[3].classList.add('hidden-body');
                root.children[4].classList.add('hidden-body');
                root.children[3].children[2].innerHTML = '❯ iam-role-session';
                root.children[3].children[2].classList.add('cli-selected');
                root.children[3].children[4].innerHTML = '&nbsp;&nbsp;noovolari-sso-1';
                root.children[3].children[4].classList.remove('cli-selected');
                root.children[4].children[5].classList.add('hidden-body');

                typeAnimate(root.children[1], 'terminal', e.currentTarget.innerText);
                steps[0] = setTimeout(function () {
                    root.children[3].classList.remove('hidden-body');
                }, 1400);
                steps[1] = setTimeout(function () {
                    root.children[3].children[2].innerHTML = '&nbsp;&nbsp;iam-role-session';
                    root.children[3].children[2].classList.remove('cli-selected');
                    root.children[3].children[4].innerHTML = '❯ noovolari-sso-1';
                    root.children[3].children[4].classList.add('cli-selected');
                }, 2000);
                steps[3] = setTimeout(function () {
                    root.children[3].classList.add('hidden-body');
                    root.children[4].classList.remove('hidden-body');
                }, 2800);
                steps[4] = setTimeout(function () {
                    root.children[4].children[5].classList.remove('hidden-body');
                }, 3600);
            }

            function commandAnimateSync(e) {
                var commandId = e.currentTarget.children[0].className;
                var c = document.querySelectorAll('.command-container.' + commandId);
                var root = c[0];
                root.children[3].classList.add('hidden-body');
                root.children[4].classList.add('hidden-body');
                root.children[3].children[2].innerHTML = '❯ AWS Single Sign-On 1';
                root.children[3].children[2].classList.add('cli-selected');
                root.children[3].children[4].innerHTML = '&nbsp;&nbsp;AWS Single Sign-On 2';
                root.children[3].children[4].classList.remove('cli-selected');
                root.children[3].children[6].innerHTML = '&nbsp;&nbsp;Test SSO';
                root.children[3].children[6].classList.remove('cli-selected');
                root.children[4].children[5].classList.add('hidden-body');

                typeAnimate(root.children[1], 'terminal', e.currentTarget.innerText);
                steps[0] = setTimeout(function () {
                    root.children[3].classList.remove('hidden-body');
                }, 1400);
                steps[1] = setTimeout(function () {
                    root.children[3].children[2].innerHTML = '&nbsp;&nbsp;AWS Single Sign-On 1';
                    root.children[3].children[2].classList.remove('cli-selected');
                    root.children[3].children[4].innerHTML = '❯ AWS Single Sign-On 2';
                    root.children[3].children[4].classList.add('cli-selected');
                }, 2000);
                steps[3] = setTimeout(function () {
                    root.children[3].classList.add('hidden-body');
                    root.children[4].classList.remove('hidden-body');
                }, 2800);
                steps[4] = setTimeout(function () {
                    root.children[4].children[5].classList.remove('hidden-body');
                }, 3600);

            }

            function commandAnimateGenerate(e) {
                var commandId = e.currentTarget.children[0].className;
                var c = document.querySelectorAll('.command-container.' + commandId);
                var root = c[0];
                root.children[3].classList.add('hidden-body');
                typeAnimate(root.children[1], 'terminal', 'leapp session generate 0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d');
                steps[0] = setTimeout(function () {
                    root.children[3].classList.remove('hidden-body');
                    root.children[3].children[8].innerHTML = '&nbsp;&nbsp; \"Expiration\":\"' + new Date(Date.now() + (4 * 60 * 60 * 1000)).toISOString() + '\"';
                }, 3800);
            }

            function showCommand(e) {
                var c = document.querySelectorAll('.command-container');
                var commandId = e.currentTarget.children[0].className;
                c.forEach((el) => {
                    el.classList.add('hidden-command');
                    if (el.classList.contains(commandId)) {
                        el.classList.toggle('hidden-command');
                    }
                })
            }
        },
        _autoPlay: function () {
            var timeout = 0;
            var commandsArray = document.getElementsByClassName('terminal-command');
            for (var i = 0; i < commandsArray.length; i++) {
                autoPlay[i] = setTimeout(clickCommand.bind(null, i), timeout);
                timeout += 5500;
            }

            function clickCommand(i) {
                $(commandsArray[i]).trigger('autoplay-event');
            }
        },
        _modal: function() {
            $('.modal-button').on('click', function(){
                var formTitle = $(this).html();
                var formAction = $(this).attr('data-action');

                $.confirm({
                    useBootstrap: false,
                    icon: 'fa fa-question-circle-o',
                    theme: 'supervan',
                    columnClass: 'small',
                    closeIcon: true,
                    animation: 'scale',
                    type: 'blue',
                    draggable: false,
                    title: formTitle,
                    content: '' +
                        '<div class="leapp-form-wrapper">' +
                            '<form class="form-request" name="form-request" accept-charset="utf-8" action="' + formAction + '" method="post">' +
                                '<fieldset>' +
                                    '<div class="paired">' +
                                        '<label for="first-name">First Name</label>' +
                                        '<input type="text" name="first-name" id="first-name" placeholder="John" required="" class="mb-2">' +
                                    '</div>' +
                                    '<div class="paired">' +
                                        '<label for="last-name">Last Name</label>' +
                                        '<input type="text" name="last-name" id="last-name" placeholder="Doe" required="" class="mb-2">' +
                                    '</div>' +
                                    '<div class="paired">' +
                                        '<label for="company">Company</label>' +
                                        '<input type="text" name="company" id="company" placeholder="Acme Corporation" required="" class="mb-2">' +
                                    '</div>' +
                                    '<div class="paired">' +
                                        '<label for="email">Company Email Address</label>' +
                                        '<input type="email" name="email" id="email" placeholder="email@domain.tld" required="" class="mb-2">' +
                                    '</div>' +
                                    '<div class="not-paired">' +
                                        '<input name="authorize" id="authorize" type="checkbox" value="1" required="">' +
                                        '<label for="authorize">Read and subscribe <a href="/privacy" target="_blank">Privacy Policy</a></label>' +
                                    '</div>' +
                                '</fieldset>' +
                            '</form>' +
                        '</div>' +
                        '<p class="status mt-2"></p>',
                    buttons: {
                        send: {
                            text: 'Submit',
                            btnClass: 'btn-blue',
                            action: function(){
                                var self = this;

                                var input = this.$content.find('input[type="text"]');
                                var inputCheck = this.$content.find('input[type="checkbox"]');
                                var formId = this.$content.find('form').attr("class");

                                console.log(inputCheck.is(':checked'));

                                if(!input.val().trim()) {
                                    $.alert({
                                        title: "Error",
                                        content: "Please don't keep fields empty.",
                                        type: 'red',
                                        boxWidth: '30%'
                                    });
                                    return false;
                                }
                                else if( !inputCheck.is(':checked') ) {
                                    $.alert({
                                        title: "Error",
                                        content: "Please accept cookie policy.",
                                        type: 'red',
                                        boxWidth: '30%'
                                    });
                                    return false;
                                }
                                else {
                                    var jqForm = this.$content.find("form");
                                    var method = jqForm.attr("method");
                                    var action = jqForm.attr("action");
                                    var status = this.$content.find(".status");
                                    var data = new FormData(jqForm[0]);

                                    fetch(action, {
                                        method: method,
                                        body: data,
                                        headers: {
                                            'Accept': 'application/json'
                                        }
                                    }).then(response => {
                                        jqForm.trigger("reset");
                                        status.fadeIn("fast").html("Thanks for your submission!");
                                    }).catch(error => {
                                        jqForm.trigger("reset");
                                        status.fadeIn("fast").html("<span class='error'> Oops! There was a problem submitting your form.</span>");
                                    });
                                }

                                setTimeout(function () {
                                    self.close();
                                }, 2000);

                                return false;
                            }
                        }
                    }
                });
            });
        },
        _typingTheHappens: function() {
            const typedTextSpan = document.querySelector(".typed-text");
            if(typedTextSpan !== null) {
                const cursorSpan = document.querySelector(".cursor");
                const textArray = JSON.parse(typedTextSpan.dataset.array);
                const typingDelay = 100;
                const erasingDelay = 50;
                const newTextDelay = 2200;
                let textArrayIndex = 0;
                let charIndex = 0;

                function type() {
                    if (charIndex < textArray[textArrayIndex].length) {
                        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                        charIndex++;
                        setTimeout(type, typingDelay);
                    } else {
                        if(textArrayIndex !== textArray.length - 1) {
                            cursorSpan.classList.remove("typing");
                            setTimeout(erase, newTextDelay);
                        } else {
                            cursorSpan.classList.add("hidden");
                        }
                    }
                }

                function erase() {
                    if (charIndex > 0) {
                        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
                        charIndex--;
                        setTimeout(erase, erasingDelay);
                    } else {
                        cursorSpan.classList.remove("typing");
                        textArrayIndex++;
                        if(textArrayIndex < textArray.length) {
                            setTimeout(type, typingDelay + 1100);
                        }
                    }
                }

                document.addEventListener("DOMContentLoaded", function() {
                    if(textArray.length) setTimeout(type, newTextDelay + 250);
                });
            }
        },
        _listPlugin: function () {
            var _self = this;
            const runQuery = (query) =>{
                $('#listPlugins').empty().addClass('loading');
                $.ajax({
                    type: 'GET',
                    url:`https://d4ekrqc4eg.execute-api.eu-west-1.amazonaws.com/api/list-plugin${query ? "?q=" + query : ""}`,
                    success: function (response) {
                        function imageExists(image_url){
                            try {
                                var http = new XMLHttpRequest();
                                http.open('HEAD', image_url, false);
                                http.onerror(() => false);
                                http.send();
                                return http.status !== 404;
                            } catch(err) {
                                return false;
                            }
                        }
                        if(response.length > 0) {
                            $(response).each((_, item) => {
                                const title = escapeSpecialCharacters(item.name);
                                const image = imageExists(`https://unpkg.com/${item.name}@latest/icon.png?meta`) ? `https://unpkg.com/${item.name}@latest/icon.png` : `https://robohash.org/${title}.png?set=set3`;
                                const author = escapeSpecialCharacters(item.author);
                                const email = escapeSpecialCharacters(item.email);
                                const description = escapeSpecialCharacters(item.description);
                                const pubdate = escapeSpecialCharacters(time_ago(new Date(item.date)));
                                const version = escapeSpecialCharacters(item.version);
                                const githubUrl = escapeSpecialCharacters(item.repositoryUrl);
                                const weeklyDownloads = item.weeklyDownloads;
                                const uri = 'leapp://' + item.name;

                                const template =
                                    `<div class="plugin-block">
                                    <div class="image-plugin">
                                        <img src="${image}" alt="${title}" class="d-block m-auto">
                                    </div>
                                    <h4>${title}</h4>
                                    <div class="author">${email !== "" ? "<a href=mailto:" : ""}${email !== "" ? email + ">" : ""}${author}${email !== "" ? "</a>" : ""}</div>
                                    <div class="description">${description}</div>
                                    <a href="${uri}" class="btn d-inline-block text-center plugin-install-button">Install</a>
                                    <div class="plugin-stats-container mb-plugin-card">
                                        <div class="version"><i class="fal fa-code-branch"></i>${githubUrl !== "" ? "<a href=" : ""}${githubUrl !== "" ? githubUrl + " target=\"_blank\">" : ""}${version}${githubUrl !== "" ? "</a>" : ""}</div>
                                        <div class="downloads"><i class="fal fa-download"></i>${weeklyDownloads}</div>
                                        <div class="pubdate"><i class="fal fa-clock"></i></i><a href="https://www.npmjs.com/package/${title}" target="_blank">${pubdate}</a></div>
                                    </div>
                                </div>`;

                                $('#listPlugins').removeClass('loading').append(template);
                            });
                        } else {
                            $('#listPlugins').removeClass('loading').append("<div class='no-plugins-found'>No plugins found.</div>");
                        }
                    }
                });
            };
            runQuery();
            document.getElementById("plugin-query-input").addEventListener("keydown", (event) => {
                if(event.code === "Enter") {
                    var query = document.getElementById("plugin-query-input").value;
                    if(query.trim() !== "") runQuery(query);
                }
            });
            document.getElementById("plugin-query-button").addEventListener("click", (event) => {
                event.preventDefault();
                var query = document.getElementById("plugin-query-input").value;
                if(query.trim() !== "") runQuery(query);
                return false;
            });
        }
    };
    function escapeSpecialCharacters (unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    function time_ago(time) {
        switch (typeof time) {
            case 'number':
                break;
            case 'string':
                time = +new Date(time);
                break;
            case 'object':
                if (time.constructor === Date) time = time.getTime();
                break;
            default:
                time = +new Date();
        }
        var time_formats = [
            [60, 'seconds', 1],
            [120, '1 minute ago', '1 minute from now'],
            [3600, 'minutes', 60],
            [7200, '1 hour ago', '1 hour from now'],
            [86400, 'hours', 3600],
            [172800, 'Yesterday', 'Tomorrow'],
            [604800, 'days', 86400],
            [1209600, 'Last week', 'Next week'],
            [2419200, 'weeks', 604800],
            [4838400, 'Last month', 'Next month'],
            [29030400, 'months', 2419200],
            [58060800, 'Last year', 'Next year'],
            [2903040000, 'years', 29030400],
            [5806080000, 'Last century', 'Next century'],
            [58060800000, 'centuries', 2903040000]
        ];
        var seconds = (+new Date() - time) / 1000,
            token = 'ago',
            list_choice = 1;

        if (seconds == 0) {
            return 'Just now'
        }
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = 'from now';
            list_choice = 2;
        }
        var i = 0,
            format;
        while (format = time_formats[i++])
            if (seconds < format[0]) {
                if (typeof format[2] == 'string')
                    return format[list_choice];
                else
                    return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
            }
        return time;
    }

    leapp.init();
})();
