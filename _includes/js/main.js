(function () {
    "use strict";

    $(function () {

        var leapp = {
            elements: {
                html: $("html"),
                hamburger: $("#hamburger"),
                navigation: $("#navigation"),
                accordion: $(".accordion"),
                dd: $('#download-select'),
                twSlider: $('#tweetSlider'),
                navAnchor: $("#navigation .anchor"),
                supportForm: $("#support-form"),
                contactsForm: $("#contacts-form")
            },
            init: function () {

                this._hamburger();
                this._dd();
                this._slick();
                this._anchor();
                this._accordion();
                this._formValidate();

            },
            _hamburger: function () {
                var _self = this;
                _self.elements.hamburger.on("click", function () {
                    _self.elements.navigation.slideToggle(200, "linear");
                    _self.elements.html.toggleClass("noscroll");
                });
            },
            _dd: function () {

                this.elements.dd.niceSelect().on('change', function () {
                    location.href = this.value;
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
                    duration: "fast",
                    easing: "linear"
                });
            },
            _anchor: function () {
                var _self = this;
                var hash = $(location).attr('hash');

                if (hash) {
                    window.scrollTo(0, 0);
                    var lastElmPos = $(hash).position().top - $("#navbar-container").outerHeight();
                    _self._scrollTo(lastElmPos);
                }
            },
            _accordion: function () {
                this.elements.accordion.on("click", ".accordion-cta", function () {
                    var cta = $(this);
                    cta.toggleClass("fa-plus").toggleClass("fa-minus");
                    cta.closest("li").find(".accordion-content").slideToggle(200, "linear");
                });
            },
            _formValidate: function () {
                
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
                        submitHandler: function() {
                            form.addEventListener("submit", handleSubmit)
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
                        submitHandler: function() {
                            form.addEventListener("submit", handleSubmit)
                        }
                    });
                }

                /* Formspree integration */
                async function handleSubmit(event) {
                    event.preventDefault();
                    var status = document.getElementById("leapp-form-status");
                    var data = new FormData(event.target);
                    status.classList.remove("error");
                    fetch(event.target.action, {
                        method: form.method,
                        body: data,
                        headers: {
                            'Accept': 'application/json'
                        }
                    }).then(response => {
                        form.reset();
                        grecaptcha.reset();
                        status.innerHTML = "Thanks for your submission!";
                    }).catch(error => {
                        status.classList.add("mystyle");
                        status.innerHTML = "<span class='error'> Oops! There was a problem submitting your form.</span>"
                    });
                    setTimeout(function(){ 
                        status.innerHTML = "";
                    }, 5000);
                }

            }
        };

        leapp.init();

    });

})();