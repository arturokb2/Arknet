
var app = new Vue({
    el: '#app_hospital',
    data: {
        data_ksg: {},
        data_ksg2: {},
        list_ds: Array(),
        sprav_list: [],
        vra_otd: [],
        // Поиск записей истории
        check_history: true,
        search_history: '',
        check_response_history: false,
        response_history: [],
        //Получаем данные из истории
        history: [],

        protoc: false,
        // Побочные поля
        ASCII: {
            "й": "Q", "ц": "W", "у": "E", "к": "R", "е": "T",
            "н": "Y", "г": "U", "ш": "I", "щ": "O",
            "з": "P", "ф": "A", "ы": "S", "в": "D", "а": "F",
            "п": "G", "р": "H", "о": "J", "л": "K", "д": "L",
            "я": "Z", "ч": "X", "с": "C", "м": "V", "и": "B",
            "т": "N", "ь": "M",
            "Й": "Q", "Ц": "W", "У": "E", "К": "R", "Е": "T",
            "Н": "Y", "Г": "U", "Ш": "I", "Щ": "O",
            "З": "P", "Ф": "A", "Ы": "S", "В": "D", "А": "F",
            "П": "G", "Р": "H", "О": "J", "Л": "K", "Д": "L",
            "Я": "Z", "Ч": "X", "С": "C", "М": "V", "И": "B",
            "Т": "N", "Ь": "M"
        },
        ds_naim: '',

        inf_onmk_sp: false,
        inf_onmk_li: false,
        next: [],
        menu_oper: false,
        menu_med_dev: false,
        menu_complication: false,
        menu_manipulation: false


    },
    mounted: function () {
        this.get_sprav_list()
    },
    methods: {
        get_sprav_list: function () {
            let query = `
          query{
              V005{
                id,
                polname
              },
              Otde{
                id,
                naim
              },
              RabNer{
                id,
                naim
              },
              T004{
                id,
                name
              },
              F003{
                id,
                naim
              },
              V014{
                id,
                tipName
              },
              Prpg{
                id,
                naim
              },
              Vrzb{
                id,
                naim
              },
              PER{
                id,
                naim
              },
              V012{
                id,  
                idIz,
                izName
               },
              V009{
                id,
                idTip,
                tipName
               },
              V020{
                id,
                kPrname
              },
              Vra(otd:""){
                id,
                kod
              },
              PROsob{
                  id,
                  kod,
                  naim
              },
              V001{
                 id,
                 kod
              },
              anesthesia{
                id,  
                kod
              },
              groupKcGroup{
                codeUslKz
              },
              Pope{
                id,  
                kod
              },
              AbObsh{
                id,  
                kod
              },
              PRPer{
                id,
                naim
              },
              Prli{
                id,  
                kod,
                naim
              },
              Trv{
                 id,
                 naim
              },
              Trvnas{
                 id, 
                 naim
              },
              Isfin{
                 id, 
                 naim
              },
              Skom{
                 id, 
                 naim
              },
              F008{
                id,  
                tipName
              },
              F011{
                id,  
                docname
              },
              TipPb{
                id,  
                naim
              },
              MetPb{
                id,  
                naim
               },
              Oksm{
                id,  
                naim
               },
               N007{
                id,   
                mrfName
               },
               N010{
                id,   
                kodIgh
               },
               N008{
                id,   
                rMName
               },
               N011{
                id,   
                rIName
               },
               N018{
                id,   
                reasName
               },
               V027{
                id,   
                nCz
               },
               N019{
                id,   
                consName
               },
               N013{
                id,   
                tlechName
               },
               N014{
                id,   
                thirName
               },
               N001{
                id,   
                protName
               },
               V028{
                id,   
                nVn
               },
               V029{
                id,   
                nMet
               },
               CodeMedDevList{
                rzn   
               },
               V036List{
                sCode
              }
               
          }`
            return fetch('graph_hospital/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            })
                .then(response => response.json())
                .then(data => {
                    this.sprav_list = data.data
                    // console.log(this.sprav_list.Vra)

                    // return data
                })
                .catch((e) => {
                    // console.log(e)
                })
        },
        update_vra_list_otd: function () {
            this.history['otd']
            let query = `
            query{
                OtdeOne(name:"${this.history['otd']}"){
                  kod
                }
              }
            `
            return fetch('graph_hospital/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            })
                .then(response => response.json())
                .then(data => {
                    // console.log(data.data.OtdeOne[0].kod)
                    let query = `
                        query{
                                Vra(otd:"${data.data.OtdeOne[0].kod}"){
                                    id,
                                    kod
                                }
                            }
                        `
                    return fetch('graph_hospital/', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ query })
                    })
                        .then(response => response.json())
                        .then(data => {
                            // console.log(this.sprav_list.Vra)
                            this.vra_otd = data.data.Vra
                        })
                })
        },
        get_history: function () {
            this.check_history = true
            let search_history_url = 'http://' + window.location.host + '/hospital/api/search_history/'
            if (this.search_history != '') {
                let ch = document.getElementById("n_dr_ctat").checked
                console.log(ch)

                let url = search_history_url + '?nib=' + this.search_history+'&ch='+ch
                // var formData = new FormData()
                // formData.append('history', this.search_history)
                // formData.append('type', 'search')


                // var r = sendRequest(url, 'get')
                //     .then(response => {
                //         this.check_response_history = true
                //         this.response_history = response.data

                //         setTimeout(() => {
                //             $("#all_nhistory button").first().focus()
                //         }, 500)

                //     })
                //     .catch(error => {
                //         this.check_response_history = false
                //     })


                fetch(url, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        //                        console.log(data)
                        this.check_response_history = true
                        this.response_history = data

                        setTimeout(() => {
                            $("#all_nhistory button").first().focus()
                        }, 500)

                    })
            }
            else {
                this.check_history = false
            }
        },
        get_data_cards: function (id) {

            var formData = new FormData()
            formData.append('id', id)
            formData.append('type', 'data_history')

            // var r = sendRequest('', 'post', formData)
            //     .then(response => {
            //         // console.log(response.data.rez)
            //         // console.log('ws://'+window.location.host)
            //         this.history = []
            //         this.history = response.data.rez
            //         // console.log(this.history['manipulation'])
            //         $("#dskz_kod_5_1").val("")
            //         $("#dsc_kod_5").val("")
            //         $("#oper_osn_5").val("")
            //         $("#dskz_kod_5_2").val("")
            //         $("#oper_osn").val("")
            //         $("#error_ksg").empty()
            //         $("#protocols").empty()
            //         if (response.data.rez.dskz.kod[0] == 'O') {
            //             document.getElementById("list-profile-list_inf_pregnancy").classList.remove("disabled")
            //         }
            //         else {
            //             document.getElementById("list-profile-list_inf_pregnancy").classList.add("disabled")
            //         }


            //         var otd = this.history.otd
            //         var dskz = this.history.dskz.kod
            //         var res = $('#rslt').val()
            //         var otde = ['НЕВРОЛОГИЯ N1', 'НЕВРОЛОГИЯ N2', 'НЕВРОЛОГИЯ N3']
            //         var resl = ['Умер 105', 'Умер в приёмном покое 106']
            //         var ds = ['G45', 'G46', 'I60', 'I60.0', 'I60.1', 'I60.2', 'I60.3', 'I60.4', 'I60.5',
            //             'I60.6', 'I60.7', 'I60.8', 'I60.9', 'I61', 'I61.0', 'I61.1', 'I61.2', 'I61.3',
            //             'I61.4', 'I61.5', 'I61.6', 'I61.8', 'I61.9', 'I62', 'I62.0', 'I62.1', 'I62.9',
            //             'I63', 'I63.0', 'I63.1', 'I63.2', 'I63.3', 'I63.4', 'I63.5', 'I63.6', 'I63.8', 'I63.9']


            //         if ((otde.indexOf(otd) != -1) && (ds.indexOf(dskz) != -1)) {
            //             document.getElementById("list-profile-list_inf_onmk").classList.remove("disabled")
            //             this.inf_onmk_sp = true
            //             if (resl.indexOf(res) != -1) {
            //                 this.inf_onmk_li = true
            //             }
            //             else {
            //                 this.inf_onmk_li = false
            //             }
            //         }
            //         else {
            //             document.getElementById("list-profile-list_inf_onmk").classList.add("disabled")
            //             this.inf_onmk_sp = false
            //             this.inf_onmk_li = false
            //         }

            //         if (response.data.rez.dskz.kod[0] == 'C') {
            //             document.getElementById("list-profile-list_inf_onk").classList.remove("disabled")
            //         }
            //         else {
            //             document.getElementById("list-profile-list_inf_onk").classList.add("disabled")
            //         }








            //         // console.log(this.sprav_list.Otde)
            //         // let otd_datalist = document.getElementById("otd-l")
            //         // for (otd of this.sprav_list.Otde) {
            //         //     let op = document.createElement("option")
            //         //     op.value = otd.naim
            //         //     op.innerHTML = otd.naim
            //         //     op.setAttribute('id_n', otd.id)
            //         //     otd_datalist.appendChild(op)
            //         // }

            //     })

            //

            fetch('', {
                method: 'POST',
                body: formData,
                // headers: {
                //     "X-CSRFToken": (document.cookie).split("=")[1]
                // }
            })
                .then(response => response.json())
                .then(data => {

                    //         this.history = []
                    this.history = data.rez
                    // console.log(this.history.med_dev)
                    // console.log(this.history['manipulation'])
                    console.log(this.history)
                    $("#dskz_kod_5_1").val("")
                    $("#dsc_kod_5").val("")
                    $("#oper_osn_5").val("")
                    $("#dskz_kod_5_2").val("")
                    $("#oper_osn").val("")
                    $("#error_ksg").empty()
                    $("#protocols").empty()

                    if (data.rez.dskz.kod[0] == 'O') {
                        document.getElementById("list-profile-list_inf_pregnancy").classList.remove("disabled")
                    }
                    else {
                        document.getElementById("list-profile-list_inf_pregnancy").classList.add("disabled")
                    }


                    var otd = this.history.otd
                    var dskz = this.history.dskz.kod
                    var res = $('#rslt').val()
                    var otde = ['НЕВРОЛОГИЯ N1', 'НЕВРОЛОГИЯ N2', 'НЕВРОЛОГИЯ N3']
                    var resl = ['Умер 105', 'Умер в приёмном покое 106']
                    var ds = ['G45', 'G46', 'I60', 'I60.0', 'I60.1', 'I60.2', 'I60.3', 'I60.4', 'I60.5',
                        'I60.6', 'I60.7', 'I60.8', 'I60.9', 'I61', 'I61.0', 'I61.1', 'I61.2', 'I61.3',
                        'I61.4', 'I61.5', 'I61.6', 'I61.8', 'I61.9', 'I62', 'I62.0', 'I62.1', 'I62.9',
                        'I63', 'I63.0', 'I63.1', 'I63.2', 'I63.3', 'I63.4', 'I63.5', 'I63.6', 'I63.8', 'I63.9']


                    if ((otde.indexOf(otd) != -1) && (ds.indexOf(dskz) != -1)) {
                        document.getElementById("list-profile-list_inf_onmk").classList.remove("disabled")
                        this.inf_onmk_sp = true
                        if (resl.indexOf(res) != -1) {
                            this.inf_onmk_li = true
                        }
                        else {
                            this.inf_onmk_li = false
                        }
                    }
                    else {
                        document.getElementById("list-profile-list_inf_onmk").classList.add("disabled")
                        this.inf_onmk_sp = false
                        this.inf_onmk_li = false
                    }

                    if (data.rez.dskz.kod[0] == 'C') {
                        document.getElementById("list-profile-list_inf_onk").classList.remove("disabled")
                    }
                    else {
                        document.getElementById("list-profile-list_inf_onk").classList.add("disabled")
                    }
                    let vds = document.getElementById("vds")
                    vds.addEventListener("change", function () {
                        $("#error_ksg").empty()
                    })
                })







        },
        rec_list_ds: function (kod, $event) {
            if (kod.length == 1) {
                kod = this.ASCII[event.data]
                if (kod != undefined) {
                    let id = event.target.id
                    if (id == 'dsny_kod') {
                        this.history.dsny.kod = kod
                    }
                    else if (id == 'ds_0_kod') {
                        this.history.ds_0.kod = kod
                    }
                    else if (id == 'dsk_kod') {
                        this.history.dsk.kod = kod
                    }
                    else if (id == 'dskz_kod') {
                        this.history.dskz.kod = kod

                        if (kod[0] == 'C') {
                            document.getElementById("list-profile-list_inf_onk").classList.remove("disabled")
                        }
                        else {
                            document.getElementById("list-profile-list_inf_onk").classList.add("disabled")
                        }

                        if (kod[0] == 'O') {
                            document.getElementById("list-profile-list_inf_pregnancy").classList.remove("disabled")
                        }
                        else {
                            document.getElementById("list-profile-list_inf_pregnancy").classList.add("disabled")
                        }

                    }
                    else if (id == 'ds_osl_kod') {
                        this.history.ds_osl.kod = kod
                    }
                    else if (id == 'dsc_kod') {
                        this.history.dsc.kod = kod
                    }
                    else if (id == 'dson_kod') {
                        this.history.dson.kod = kod
                    }

                    else if (id == 'ds_let_kod') {
                        this.history.ds_let.kod = kod
                    }
                    else if (id == 'dspat_kod') {
                        this.history.dspat.kod = kod
                    }
                    else if (id == 'details_kod') {
                        this.history.details.kod = kod
                    }
                    else if (id == 'dskz2_kod') {
                        this.history.dskz2.kod = kod
                    }
                    else if (id == 'dskz3_kod') {
                        this.history.dskz3.kod = kod
                    }
                }

            }
            let query = `
          query{
              DsList(ds:"${kod}"){
                kod
              }
          }`
            fetch('graph_hospital/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            })
                .then(response => response.json())
                .then(data => {
                    let ds = []
                    data.data.DsList.forEach(function (data) {
                        ds.push(data.kod)
                    })
                    this.list_ds = ds

                })
                .catch((e) => {
                    // console.log(e)
                })

        },
        rec_ds_naim: function (kod, $event) {
            this.ds_naim = ''
            let id = event.target.id
            let query = `
              query{
                  DsName(ds:"${kod}"){
                    naim
                  },
                  DSMod(ds:"${kod}"){
                    kod
                },
                DSModSop(ds:"${kod}"){
                    kod
                }
              }`
            fetch('graph_hospital/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            })
                .then(response => response.json())
                .then(data => {
                    this.check_ksg()
                    this.check_ksg2()
                    if (id == 'dsny_kod') {
                        this.history.dsny.naim = data.data.DsName[0].naim.substr(0, 50)
                    }
                    else if (id == 'ds_0_kod') {
                        this.history.ds_0.naim = data.data.DsName[0].naim.substr(0, 50)
                    }
                    else if (id == 'dsk_kod') {
                        this.history.dsk.naim = data.data.DsName[0].naim.substr(0, 50)
                    }
                    else if (id == 'dskz_kod') {
                        if (data.data.DSMod.length > 0) {
                            alert(`Направить историю болезни на экспертизу качества, DS = ${this.history.dskz.kod}`)
                        }
                        this.history.dskz.naim = data.data.DsName[0].naim.substr(0, 50)
                    }
                    else if (id == 'ds_osl_kod') {
                        // console.log(data.data)
                        if (data.data.DSModSop.length > 0) {
                            alert(`Направить историю болезни на экспертизу качества, DS = ${this.history.ds_osl.kod}`)
                        }
                        this.history.ds_osl.naim = data.data.DsName[0].naim.substr(0, 50)
                    }
                    else if (id == 'dsc_kod') {
                        if (data.data.DSMod.length > 0) {
                            alert(`Направить историю болезни на экспертизу качества, DS = ${this.history.dsc.kod}`)
                        }
                        this.history.dsc.naim = data.data.DsName[0].naim.substr(0, 50)
                    }
                    else if (id == 'dson_kod') {
                        this.history.dson.naim = data.data.DsName[0].naim.substr(0, 50)
                    }
                    else if (id == 'ds_let_kod') {
                        this.history.ds_let.naim = data.data.DsName[0].naim.substr(0, 50)
                    }
                    else if (id == 'dspat_kod') {
                        this.history.dspat.naim = data.data.DsName[0].naim.substr(0, 50)
                    }
                    else if (id == 'details_kod') {
                        this.history.details.naim = data.data.DsName[0].naim.substr(0, 50)
                    }

                })
                .catch((e) => {
                    // console.log(e)
                })
        },
        check_vds: function () {
            if (this.history.vds != 'ВТМП баз.программа ОМС' && this.history.vds != 'ВТМП сверхбаз.программа') {
                this.check_ksg()
                this.check_ksg2()
            }
            else {
                this.check_vt()
            }
        },
        next_inf_pers_info: function () {
            document.getElementById("list-home-list_inf_pers_info").click()
            setTimeout(() => {
                $("#fam").focus()
            }, 1000)
        },
        next_inf_diagnoses: function () {
            document.getElementById("list-profile-list_inf_diagnoses").click()

            setTimeout(() => {
                $("#dsny_kod").focus()
            }, 500)
        },
        next_inf_koyko: function () {
            document.getElementById("list-profile-list_inf_koyko").click()
        },
        next_inf_operation: function () {
            document.getElementById("list-profile-list_inf_operation").click()
            document.getElementById("list-profile-list_inf_operation").click()
        },
        next_inf_ks_zabolev: function () {
            // document.getElementById("list-profile-list_inf_ks_zabolev").click()
            let ksg_osn = document.getElementById("ksg_osn")
            let ksg_sop = document.getElementById("ksg_sop")
            let error_vds = document.getElementById("error_vds")
            if ($("#vds").val().length == 0) {
                if (ksg_osn != null && ksg_sop != null) {
                    ksg_osn.setAttribute("disabled", "disabled")
                    ksg_sop.setAttribute("disabled", "disabled")

                    error_vds.innerHTML = 'Источник оплаты не заполнен'
                }
            }
            else {
                if (ksg_osn != null && ksg_sop != null) {
                    ksg_osn.removeAttribute("disabled")
                    ksg_sop.removeAttribute("disabled")
                    error_vds.innerHTML = ''
                }
            }
            if (app.history.vds != 'ВТМП баз.программа ОМС' && app.history.vds != 'ВТМП сверхбаз.программа') {
                setTimeout(() => {
                    $("#ksg_osn").focus()
                    this.ksg_osn_onchange()
                    // console.log(this.history.oper)
                    if (this.history.oper.length > 0) {
                        for (oper of this.history.oper) {
                            if (oper.pop == "Да") {
                                document.getElementById("oper_osn").value = oper.kod_op
                                break
                            }
                            else {
                                document.getElementById("oper_osn").value = ""
                            }
                        }
                    }
                    else {
                        document.getElementById("oper_osn").value = ""
                    }
                }, 500)
            }
            else {
                setTimeout(() => {
                    $("#metod_hmp").focus()
                }, 500)
            }
            this.check_vds()
        },
        next_inf_manipulation: function () {
            setTimeout(() => {
                document.getElementById("list-profile-list_inf_manipulation").click()
            }, 500)
        },
        next_inf_translations: function () {
            setTimeout(() => {
                $("#potd").focus()
            }, 800)
        },
        next_inf_post_mortem: function () {
            setTimeout(() => {
                $("#wskr_date").focus()
            }, 500)
        },
        next_inf_injury: function () {
            setTimeout(() => {
                $(".dskz_kod").focus()
            }, 500)
        },
        next_inf_policy_passport_snills: function () {
            setTimeout(() => {
                $("#vds").focus()
            }, 500)
        },
        next_inf_pregnancy: function () {
            setTimeout(() => {
                // $("#vb_a_datv").focus()
                $("#srber").focus()
            }, 500)
        },
        next_inf_disability: function () {
            setTimeout(() => {
                $("#dat_l1").focus()
            }, 500)
        },
        next_inf_patient_p: function () {
            setTimeout(() => {
                $("#fam_p").focus()
            }, 500)
        },
        next_inf_adr: function () {
            setTimeout(() => {
                $("#c_oksm_in").focus()
            }, 500)
        },
        next_inf_onk: function () {
            setTimeout(() => {
                $("#ds1_t").focus()
            }, 500)
        },
        next_inf_mo: function () {
            setTimeout(() => {
                $("#pmg").focus()
            }, 500)
        },
        ksg_osn_onchange: function () {

            if (($("#vds").val() != "") && app.history.vds != 'ВТМП баз.программа ОМС' && app.history.vds != 'ВТМП сверхбаз.программа') {
                if ($("#ksg_osn").val() != "") {
                    let query = `
                  query{
                    T003Ksg(ksg:"${$("#ksg_osn").val()}"){
                        kod,
                        name,
                        codeUslKz
                      }
                  }`
                    fetch('graph_hospital/', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ query })
                    })
                        .then(response => response.json())
                        .then(data => {
                            // console.log(data)
                            if (typeof (data.data.T003Ksg[0]) != 'undefined') { app.$data.history.code_usl_name = data.data.T003Ksg[0].name } else { app.$data.history.code_usl_name = '' }
                            if (typeof (data.data.T003Ksg[0]) != 'undefined') { app.$data.history.code_usl = data.data.T003Ksg[0].kod } else { app.$data.history.code_usl = '' }

                            let query = `
                            query{
                                groupKcGroupGetKsg(ksg:"${data.data.T003Ksg[0].codeUslKz}"){
                                    ksg,
                                    ikk
                                }
                            }`
                            fetch('graph_hospital/', {
                                method: 'post',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ query })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log(data)
                                    if (typeof (data.data.groupKcGroupGetKsg[0]) != 'undefined') { app.$data.history.ksg_osn_all = data.data.groupKcGroupGetKsg[0].ksg } else { app.$data.history.ksg_osn_all = '' }
                                    //                                    if (typeof (data.data.groupKcGroupGetKsg[0]) != 'undefined') { app.$data.history.oopkk = data.data.groupKcGroupGetKsg[0].ikk } else { app.$data.history.oopkk = '' }
                                    // if (typeof (data.data.groupKcGroupGetKsg[0]) != 'undefined' && app.$data.history.oopkk  != '') { app.$data.history.oopkk = data.data.groupKcGroupGetKsg[0].ikk }
                                    if (typeof (data.data.groupKcGroupGetKsg[0]) != 'undefined') {
                                        let query = `
                                            query{
                                                groupKcDkk(ksg:"${app.$data.history.ksg_osn_all}"){
                                                    kod  
                                                }
                                            }`
                                        fetch('graph_hospital/', {
                                            method: 'post',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ query })
                                        })
                                            .then(response => response.json())
                                            .then(data => {
                                                $("#oopkk_l").empty()
                                                console.log(data)
                                                for (d of data.data.groupKcDkk) {
                                                    if (d.kod != null) {
                                                        op = document.createElement("option")
                                                        op.innerHTML = d.kod
                                                        document.getElementById("oopkk_l").appendChild(op)
                                                    }
                                                }
                                                // if (typeof (data.data.groupKcDkk[0]) != 'undefined') { app.$data.history.oopkk = data.data.groupKcDkk[0].kod } else { app.$data.history.oopkk = '' }


                                            })
                                            .catch((e) => {
                                                // console.log(e)
                                            })
                                    }
                                })

                        })

                    setTimeout(this.check_ksg, 1500)

                }

                // query{
                //     groupKcGroupGetKsg(ksg:"6.2"){
                //         ksg
                //     }
                //   }

                // if ($("#ksg_osn").val() != "") {

                //     let query = `
                //   query{
                //       T006KsgCodeUslTitle(ksg:"${$("#ksg_osn").val()}"){
                //         ksg
                //         codeUsl
                //         title
                //       }
                //   }`
                //     fetch('graph_hospital/', {
                //         method: 'post',
                //         headers: {
                //             'Content-Type': 'application/json',
                //         },
                //         body: JSON.stringify({ query })
                //     })
                //         .then(response => response.json())
                //         .then(data => {

                //             // if (typeof (data.data.T006KsgCodeUslTitle[0]) != 'undefined') { app.$data.history.ksg_osn = data.data.T006KsgCodeUslTitle[0].ksg } else { app.$data.history.ksg_osn_all = '' }

                //             if (typeof (data.data.T006KsgCodeUslTitle[0]) != 'undefined') { app.$data.history.ksg_osn_all = data.data.T006KsgCodeUslTitle[0].ksg } else { app.$data.history.ksg_osn_all = '' }
                //             if (typeof (data.data.T006KsgCodeUslTitle[0]) != 'undefined') { app.$data.history.code_usl = data.data.T006KsgCodeUslTitle[0].codeUsl } else { app.$data.history.code_usl = '' }
                //             if (typeof (data.data.T006KsgCodeUslTitle[0]) != 'undefined') { app.$data.history.code_usl_name = data.data.T006KsgCodeUslTitle[0].title } else { app.$data.history.code_usl_name = '' }

                //             let query = `
                //           query{
                //               groupKcDkk(ksg:"${data.data.T006KsgCodeUslTitle[0].ksg}"){
                //                 kod
                //               }
                //           }`
                //             fetch('graph_hospital/', {
                //                 method: 'post',
                //                 headers: {
                //                     'Content-Type': 'application/json',
                //                 },
                //                 body: JSON.stringify({ query })
                //             })
                //                 .then(response => response.json())
                //                 .then(data => {
                //                     if (typeof (data.data.groupKcDkk[0]) != 'undefined') { app.$data.history.oopkk = data.data.groupKcDkk[0].kod } else { app.$data.history.oopkk = '' }


                //                 })
                //                 .catch((e) => {
                //                     // console.log(e)
                //                 })
                //         })
                //         .catch((e) => {
                //             // console.log(e)
                //         })

                //     setTimeout(this.check_ksg, 1500)
                // }
            }
            else {
                $("#error_ksg").empty()
            }
        },
        ksg_osn_sop_onchange: function () {
            let data = {
                dsc: $.trim($("#dsc_kod").val()),
                ksg_sop: this.history.ksg_sop
            }
            fetch(`check_ksg_sop/?dsc=${data.dsc}&ksg_sop=${data.ksg_sop}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(rez => {
                    this.history.ksg_sop_helper = rez.rez
                })

        },
        ksg_osn2_onchange: function () {
            if (($("#vds").val() != "") && app.history.vds != 'ВТМП баз.программа ОМС' && app.history.vds != 'ВТМП сверхбаз.программа') {
                if ($("#ksg_osn2").val() != "") {
                    let query = `
                  query{
                    T003Ksg(ksg:"${$("#ksg_osn2").val()}"){
                        kod,
                        name,
                        codeUslKz
                      }
                  }`

                    fetch('graph_hospital/', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ query })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (typeof (data.data.T003Ksg[0]) != 'undefined') { app.$data.history.code_usl_name2 = data.data.T003Ksg[0].name } else { app.$data.history.code_usl_name2 = '' }
                            if (typeof (data.data.T003Ksg[0]) != 'undefined') { app.$data.history.code_usl2 = data.data.T003Ksg[0].kod } else { app.$data.history.code_usl2 = '' }
                            let query = `
                            query{
                                groupKcGroupGetKsg(ksg:"${data.data.T003Ksg[0].codeUslKz}"){
                                    ksg,
                                    ikk
                                }
                            }`
                            fetch('graph_hospital/', {
                                method: 'post',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ query })
                            })
                                .then(response => response.json())
                                .then(data => { 
                                    if (typeof (data.data.groupKcGroupGetKsg[0]) != 'undefined') { app.$data.history.ksg_osn2_all = data.data.groupKcGroupGetKsg[0].ksg } else { app.$data.history.ksg_osn2_all = '' }
                                    if (typeof (data.data.groupKcGroupGetKsg[0]) != 'undefined' && app.$data.history.oopkk != '')  { app.$data.history.oopkk2 = data.data.groupKcGroupGetKsg[0].ikk }
                                    if (typeof (data.data.groupKcGroupGetKsg[0]) != 'undefined') {
                                        let query = `
                                        query{
                                            groupKcDkk(ksg:"${app.$data.history.ksg_osn2_all}"){
                                                kod  
                                            }
                                        }`

                                        fetch('graph_hospital/', {
                                            method: 'post',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ query })
                                        })
                                            .then(response => response.json())
                                            .then(data => {
                                                $("#oopkk_2_l").empty()

                                                for (d of data.data.groupKcDkk) {
                                                    if (d.kod != null) {
                                                        op = document.createElement("option")
                                                        op.innerHTML = d.kod
                                                        document.getElementById("oopkk_2_l").appendChild(op)
                                                    }
                                                }
                                                // if (typeof (data.data.groupKcDkk[0]) != 'undefined') { app.$data.history.oopkk = data.data.groupKcDkk[0].kod } else { app.$data.history.oopkk = '' }


                                            })
                                    }
                                    

                                })   
                        })
                        setTimeout(this.check_ksg2, 1500)



                }
            }
        },
        check_ksg: function () {
            if (this.history.ksg_osn != '') {
                let pol = ''
                if (this.history.pol != '') {
                    if (this.history.pol == 'Мужской') {
                        pol = '1'
                    }
                    else {
                        pol = '2'
                    }

                }
                var ds = ''
                if ($('#dskz2_kod').val().length > 0) {
                    ds = $.trim($('#dskz2_kod').val())
                }
                else {
                    ds = $.trim($("#dskz_kod").val())
                }

                let data = {
                    // dskz: $.trim($("#dskz_kod").val()),
                    dskz: ds,
                    dsc: $.trim($("#dsc_kod").val()),
                    ds_osl: $.trim($("#ds_osl_kod").val()),
                    ksg_osn: this.history.ksg_osn,
                    ksg_osn_all: this.history.ksg_osn_all,
                    pol: pol,
                    datr: this.history.datr,
                    oper_osn: $("#oper_osn").val(),
                    oopkk: $.trim($("#oopkk").val()),
                    code_usl: app.$data.history.code_usl,
                    datv: $.trim($("#datv").val()),
                    datp: $.trim($("#datp").val()),
                }
                app.$data.data_ksg = data
                if ($("#ksg_osn").val().length > 0) {
                    fetch(`check_ksg/?dskz=${data.dskz}&ksg_osn=${data.ksg_osn}&dsc=${data.dsc}&ksg_osn_all=${data.ksg_osn_all}
                    &pol=${data.pol}&datr=${data.datr}&oper_osn=${data.oper_osn}&ds_osl=${data.ds_osl}
                    &oopkk=${data.oopkk}&code_usl=${data.code_usl}&datv=${data.datv}&datp=${data.datp}`, {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then(response => response.json())
                        .then(rez => {
                            this.history.ksg_osn_helper = rez.r
                            let protocols = document.getElementById("error_ksg")
                            $('#error_ksg').empty();
                            for (r of rez.rez) {
                                var p = document.createElement("p")

                                p.innerHTML = r
                                protocols.appendChild(p)
                            }
                        })
                }

            }


        },
        check_ksg2:function(){
            if (this.history.ksg_osn2 != '') {
                let pol = ''
                if (this.history.pol != '') {
                    if (this.history.pol == 'Мужской') {
                        pol = '1'
                    }
                    else {
                        pol = '2'
                    }

                }
                var ds = $.trim($("#dskz3_kod").val())

                let data = {
                    dskz: ds,
                    dsc: '',
                    ds_osl: '',
                    ksg_osn: this.history.ksg_osn2,
                    ksg_osn_all: this.history.ksg_osn2_all,
                    pol: pol,
                    datr: this.history.datr,
                    oper_osn: '',
                    oopkk: $.trim($("#oopkk2").val()),
                    code_usl: app.$data.history.code_usl2,
                    datv: $.trim($("#datv").val()),
                    datp: $.trim($("#datp").val()),
                }
                app.$data.data_ksg2 = data
                if ($("#ksg_osn2").val().length > 0) {
                    fetch(`check_ksg/?dskz=${data.dskz}&ksg_osn=${data.ksg_osn}&dsc=${data.dsc}&ksg_osn_all=${data.ksg_osn_all}
                    &pol=${data.pol}&datr=${data.datr}&oper_osn=${data.oper_osn}&ds_osl=${data.ds_osl}
                    &oopkk=${data.oopkk}&code_usl=${data.code_usl}&datv=${data.datv}&datp=${data.datp}`, {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(response => response.json())
                        .then(rez => {
                            
                            this.history.ksg_osn_2_helper = rez.r
                            let protocols = document.getElementById("error_ksg2")
                            $('#error_ksg2').empty();
                            if (rez.rez.length > 0){
                                var p = document.createElement("p")
                            p.innerHTML = 'Ошибки во втором ксг.'
                            protocols.appendChild(p)
                            }
                            for (r of rez.rez) {
                                var p = document.createElement("p")

                                p.innerHTML = r
                                protocols.appendChild(p)
                            }
                        })
                }
            }

        },
        check_vt: function () {
            if (this.history.vds == 'ВТМП баз.программа ОМС' || this.history.vds == 'ВТМП сверхбаз.программа') {
                let data = {
                    dskz: $.trim($("#dskz_kod").val()),
                    metod_hmp: this.history.metod_hmp,
                    vid_hmp: this.history.vid_hmp,
                    code_usl_vt: this.history.code_usl_vt
                }

                if (this.history.metod_hmp != '' && this.history.vid_hmp != '') {
                    fetch(`check_vt/?dskz=${data.dskz}&metod_hmp=${data.metod_hmp}&vid_hmp=${data.vid_hmp}&code_usl_vt=${data.code_usl_vt}`, {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then(response => response.json())
                        .then(rez => {
                            let protocols = document.getElementById("error_ksg")
                            $('#error_ksg').empty();
                            for (r of rez.rez) {
                                var p = document.createElement("p")
                                p.innerHTML = r
                                protocols.appendChild(p)
                            }
                        })
                }
            }

        },
        code_usl: function () {
            var query = ''
            if (app.$data.history.vds == 'ВТМП баз.программа ОМС') {
                if ($("#metod_hmp").val() != '' && $("#vid_hmp").val() != '') {
                    query = `
                      query {
                         TarVt(isf:"Д",kodStat:"${$("#metod_hmp").val()}",metod:"${$("#vid_hmp").val()}"){
                            kod
                            naim
                            }
                      }`
                }

            }
            else {
                if ($("#metod_hmp").val() != '' && $("#vid_hmp").val() != '') {
                    query = `
                      query {
                        TarVt(isf:"5",kodStat:"${$("#metod_hmp").val()}",metod:"${$("#vid_hmp").val()}"){
                            kod
                            naim
                           }
                      }`
                }
            }
            if (query != '') {
                fetch('graph_hospital/', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.data.TarVt)
                        // console.log(data.data.TarVt.length)


                        if (data.data.TarVt.length > 0) {
                            $("#error_ksg").empty()
                            app.$data.history.code_usl_vt = data.data.TarVt[0].kod
                            app.$data.history.code_usl_vt_name = data.data.TarVt[0].naim
                        }
                        else {
                            app.$data.history.code_usl_vt = ''
                            app.$data.history.code_usl_vt_name = ''


                            $("#error_ksg").empty()
                            let error_ksg = document.getElementById("error_ksg")
                            let p = document.createElement("p")
                            p.innerHTML = 'Код вида ВМП не соответсвует коду метода'
                            error_ksg.appendChild(p)
                        }
                    })
                    .catch((e) => {
                        // console.log(e)
                    })
            }

            this.check_vt()
        },
        get_v_018_v_019: function () {
            $("#metod_hmp").empty()
            $("#vid_hmp").empty()
            if (app.$data.history.vds == 'ВТМП баз.программа ОМС') {
                let query = `
                  query {
                    TarVtList(isf:"Д"){
                        kodStat,
                        metod
                       }
                  }`
                return fetch('graph_hospital/', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query })
                })
                    .then(response => response.json())
                    .then(data => {
                        TarVtList = data.data.TarVtList

                        for (vt of TarVtList) {
                            let op_hmp = document.createElement("option")
                            op_hmp.innerHTML = vt.kodStat
                            document.getElementById("vid_vme_l").appendChild(op_hmp)
                            vid = vt.metod.split(',')
                            vid.forEach(function (item) {
                                if (item != "") {
                                    op_hmp = document.createElement("option")
                                    op_hmp.innerHTML = item
                                    document.getElementById("vid_hmp_l").appendChild(op_hmp)
                                }
                            })
                        }

                    })
                    .catch((e) => {
                        // console.log(e)
                    })
            }
            else if (app.$data.history.vds == 'ВТМП сверхбаз.программа') {
                $("#metod_hmp").empty()
                $("#vid_hmp").empty()
                let query = `
                      query {
                        TarVtList(isf:"5"){
                            kodStat,
                            metod
                           }
                      }`
                return fetch('graph_hospital/', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query })
                })
                    .then(response => response.json())
                    .then(data => {
                        TarVtList = data.data.TarVtList

                        for (vt of TarVtList) {
                            let op_hmp = document.createElement("option")
                            op_hmp.innerHTML = vt.kodStat
                            document.getElementById("vid_vme_l").appendChild(op_hmp)
                            vid = vt.metod.split(',')
                            vid.forEach(function (item) {
                                if (item != "") {
                                    op_hmp = document.createElement("option")
                                    op_hmp.innerHTML = item
                                    document.getElementById("vid_hmp_l").appendChild(op_hmp)
                                }
                            })
                        }

                    })
                    .catch((e) => {
                        // console.log(e)
                    })

            }
            // setTimeout(this.check_vt, 1500)
        },
        Select_trs: function () {
            let trs_radio = document.getElementById("Trs").getElementsByClassName("form-group form-check")
            for (let trs in trs_radio) {
                try {
                    trs_radio[trs].childNodes[0].checked = false
                }
                catch (err) {
                }
            }

            if (app.$data.history.trs != null) {
                var v_trs = app.$data.history.trs
            }
            else {
                var v_trs = ''
            }
            for (let trs in trs_radio) {
                try {
                    let input = trs_radio[trs].getElementsByTagName("input")
                    input[0].onclick = function () {
                        // console.log(app.$data.history.trs)
                        app.$data.history.trs = trs_radio[trs].textContent.replace(/\s+/g, ' ').trim()
                        document.getElementById("list-profile-list_inf_work_capacity").click()
                    }


                    if (trs_radio[trs].textContent.replace(/\s+/g, ' ').trim() == v_trs) {
                        trs_radio[trs].childNodes[0].checked = true
                    }
                }
                catch (err) {
                }
                try {
                    let label = trs_radio[trs].getElementsByTagName("label")
                    label[0].onclick = function () {
                        // console.log(app.$data.history.trs)
                        app.$data.history.trs = trs_radio[trs].textContent.replace(/\s+/g, ' ').trim()
                        document.getElementById("list-profile-list_inf_work_capacity").click()
                    }


                    if (trs_radio[trs].textContent.replace(/\s+/g, ' ').trim() == v_trs) {
                        trs_radio[trs].childNodes[0].checked = true
                    }
                }
                catch (err) {
                }
            }
        },
        onmk: function () {
            this.Onmk_sp_u()
            this.Onmk_li_u()
        },
        Onmk_sp_u: function () {
            $('input[name="p001_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p001 = event.target.getAttribute('n')
            })
            $('input[name="p002_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p002 = event.target.getAttribute('n')
            })
            $('input[name="p003_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p003 = event.target.getAttribute('n')
            })
            $('input[name="p004_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p004 = event.target.getAttribute('n')
            })
            $('input[name="p005_1_sp"]').click(function (event) {

                app.$data.history.onmk_sp.p005_1 = event.target.getAttribute('n')
            })
            $('input[name="p005_2_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p005_2 = event.target.getAttribute('n')
            })
            $('input[name="p006_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p006 = event.target.getAttribute('n')
            })
            $('input[name="p007_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p007 = event.target.getAttribute('n')
            })
            $('input[name="p008_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p008 = event.target.getAttribute('n')
            })
            $('input[name="p009_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p009 = event.target.getAttribute('n')
            })
            $('input[name="p010_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p010 = event.target.getAttribute('n')
            })
            $('input[name="p011_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p011 = event.target.getAttribute('n')
            })
            $('input[name="p012_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p012 = event.target.getAttribute('n')
            })
            $('input[name="p013_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p013 = event.target.getAttribute('n')
            })
            $('input[name="p014_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p014 = event.target.getAttribute('n')
            })
            $('input[name="p015_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p015 = event.target.getAttribute('n')
            })
            $('input[name="p016_sp"]').click(function (event) {
                app.$data.history.onmk_sp.p016 = event.target.getAttribute('n')
            })
        },
        Onmk_li_u: function () {

        },
        onk: function () {
            this.get_stad()
            this.get_onk_t()
            this.get_onk_n()
            this.get_onk_m()
            this.get_diag_code()
            this.get_diag_rslt()
        },
        get_stad: function () {
            let kod = app.$data.history.dskz.kod

            let query = `
                      query {
                        N002(ds:"${kod}") {
                          kodSt
                        }
                      }`
            return fetch('graph_hospital/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            })
                .then(response => response.json())
                .then(data => {
                    let stads = data.data.N002
                    let stad = document.getElementById('stad-l')
                    stad.innerText = ''
                    stad.innerHTML = ''
                    let str_stad = ''

                    for (let s in stads) {
                        let option = document.createElement("option")
                        option.value = stads[s].kodSt
                        stad.appendChild(option)
                    }
                })
                .catch((e) => {
                    // console.log(e)
                })


        },
        get_onk_t: function () {
            let kod = app.$data.history.dskz.kod
            let query = `
                      query {
                        N003(ds:"${kod}") {
                          kodT
                        }
                      }`
            return fetch('graph_hospital/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            })
                .then(response => response.json())
                .then(data => {
                    let onk_ts = data.data.N003
                    let onk_t = document.getElementById('onk_t-l')
                    onk_t.innerText = ''
                    onk_t.innerHTML = ''
                    for (let o in onk_ts) {
                        let option = document.createElement("option")
                        option.value = onk_ts[o].kodT
                        onk_t.appendChild(option)
                    }
                })
                .catch((e) => {
                    // console.log(e)
                })
        },
        get_onk_n: function () {
            let kod = app.$data.history.dskz.kod

            let query = `
                      query {
                        N004(ds:"${kod}") {
                          kodN
                        }
                      }`
            return fetch('graph_hospital/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            })
                .then(response => response.json())
                .then(data => {
                    let onk_ns = data.data.N004
                    let onk_n = document.getElementById('onk_n-l')
                    onk_n.innerText = ''
                    onk_n.innerHTML = ''
                    for (let o in onk_ns) {
                        let option = document.createElement("option")
                        option.value = onk_ns[o].kodN
                        onk_n.appendChild(option)
                    }
                })
                .catch((e) => {
                    // console.log(e)
                })


        },
        get_onk_m: function () {
            let kod = app.$data.history.dskz.kod

            let query = `
                      query {
                        N005(ds:"${kod}") {
                          kodM
                        }
                      }`
            return fetch('graph_hospital/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            })
                .then(response => response.json())
                .then(data => {
                    let onk_ms = data.data.N005
                    let onk_m = document.getElementById('onk_m-l')
                    onk_m.innerText = ''
                    onk_m.innerHTML = ''
                    for (let o in onk_ms) {
                        let option = document.createElement("option")
                        option.value = onk_ms[o].kodM
                        onk_m.appendChild(option)
                    }
                })
                .catch((e) => {
                    // console.log(e)
                })
        },
        get_diag_code: function () {
            let diag_code = app.$data.history.diag_tip
            var diag = document.getElementById("diag_code-l")
            let code = []
            diag.innerHTML = ''
            if (diag_code != undefined) {
                if (diag_code == 'Гистологический признак') {
                    app.$data.sprav_list.N007.forEach(function (data) {
                        code.push(data.mrfName)
                    })


                }
                else {
                    app.$data.sprav_list.N010.forEach(function (data) {
                        code.push(data.kodIgh)
                    })
                }
                for (let c in code) {
                    let option = document.createElement("option")
                    option.value = code[c]
                    diag.appendChild(option)
                }
            }
        },
        get_diag_rslt: function () {
            let diag_code = app.$data.history.diag_tip
            if (diag_code != NaN) {
                var diag = document.getElementById("diag_rslt-l")
                let code = []
                if (diag_code == 'Гистологический признак') {
                    app.$data.sprav_list.N008.forEach(function (data) {
                        code.push(data.rMName)
                    })
                }
                else {
                    app.$data.sprav_list.N011.forEach(function (data) {
                        code.push(data.rIName)
                    })
                }
                for (let c in code) {
                    let option = document.createElement("option")
                    option.value = code[c]
                    diag.appendChild(option)
                }
            }
        },
        onmk_disabled: function () {
            this.check_vt()
            var otd = $("#otd").val()
            var dskz = $("#dskz_kod").val()
            var res = $("#rslt").val()
            var otde = ['НЕВРОЛОГИЯ N1', 'НЕВРОЛОГИЯ N2', 'НЕВРОЛОГИЯ N3']
            var ds = ['G45', 'G46', 'I60', 'I60.0', 'I60.1', 'I60.2', 'I60.3', 'I60.4', 'I60.5',
                'I60.6', 'I60.7', 'I60.8', 'I60.9', 'I61', 'I61.0', 'I61.1', 'I61.2', 'I61.3',
                'I61.4', 'I61.5', 'I61.6', 'I61.8', 'I61.9', 'I62', 'I62.0', 'I62.1', 'I62.9',
                'I63', 'I63.0', 'I63.1', 'I63.2', 'I63.3', 'I63.4', 'I63.5', 'I63.6', 'I63.8', 'I63.9']
            var resl = ['Умер 105', 'Умер в приёмном покое 106']

            if ((otde.indexOf(otd) != -1) && (ds.indexOf(dskz) != -1)) {
                document.getElementById("list-profile-list_inf_onmk").classList.remove("disabled")
                app.$data.inf_onmk_sp = true
                if (resl.indexOf(res) != -1) {
                    app.$data.inf_onmk_li = true
                }
                else {
                    app.$data.inf_onmk_li = false
                }
            }
            else {
                document.getElementById("list-profile-list_inf_onmk").classList.add("disabled")
                app.$data.inf_onmk_sp = false
            }
        },
        next_tabs: function () {
            el = event.target
            if (el.id == "rslt") {
                if (app.$data.history.dskz.kod[0] == "O") {
                    document.getElementById("list-profile-list_inf_pregnancy").click()
                }
                else if (app.$data.history.dskz.kod[0] == "C") {
                    document.getElementById("list-profile-list_inf_onk").click()
                }
                else if ((app.$data.history.rslt == "Умер 105") || (app.$data.history.rslt == "Умер в приёмном покое 106")) {
                    document.getElementById("list-profile-list_inf_post_mortem").click()
                }
                else if ((app.$data.history.rslt == "Переведён в др. ЛПУ 102") || (app.$data.history.rslt == "Переведён в дневной стационар 103")
                    || (app.$data.history.rslt == "Переведён на другой профиль коек 104")) {
                    document.getElementById("list-profile-list_inf_translations").click()
                }
                else if ((app.$data.history.dskz.kod[0] == "S") || (app.$data.history.dskz.kod[0] == "T")) {
                    document.getElementById("list-profile-list_inf_injury").click()
                }

                else {
                    document.getElementById("list-profile-list_inf_koyko").click()
                }
            }
            if (el.id == "m_prer") {
                if ((app.$data.history.rslt == "Умер 105") || (app.$data.history.rslt == "Умер в приёмном покое 106")) {
                    document.getElementById("list-profile-list_inf_post_mortem").click()
                }
                else {
                    document.getElementById("list-profile-list_inf_koyko").click()
                }
            }
            if (el.id == "otd_y") {
                if (document.getElementById("list-profile-list_inf_onmk").classList.contains("disabled")) {
                    document.getElementById("list-profile-list_inf_koyko").click()
                }
                else {
                    document.getElementById("list-profile-list_inf_onmk").click()
                }
            }
            if (el.id == "napr_usl") {
                document.getElementById("list-profile-list_inf_koyko").click()
            }
        },
        adr_in: function () {
            // this.history.adr = $("#adr_in").val()
            // this.history.okatop = $("#adr_in").attr("data-kladr-id")
            // console.log(this.history.adr,this.history.okatop)
        },
        replace_code_usl: function () {
            let code = document.getElementById("ksg_osn")
            code.value = code.value.replace(",", ".")
        },
        replace_ds: function (event) {
            console.log(event.target)
            event.target.value = event.target.value.replace(",", ".")
        },
        replace_ksg_sop: function () {
            let sop = document.getElementById("ksg_sop")
            sop.value = sop.value.replace(",", ".")
        },
        replace_code_usl2: function () {
            let sop = document.getElementById("ksg_osn2")
            sop.value = sop.value.replace(",", ".")
        },
        save: function () {
            let otd = document.getElementById("otd")
            if (app.$data.history.vds != 'ВТМП баз.программа ОМС' && app.$data.history.vds != 'ВТМП сверхбаз.программа') {
                app.$data.history.tip_oms = '1'
            }
            else {
                app.$data.history.tip_oms = '2'
            }

            start_prot()

            let protocols = document.getElementById("protocols")

            if (protocols.childNodes.length == 0) {
                app.$data.history.err = false
                app.$data.history.err_text = ''
                let formData = new FormData()
                app.$data.history['data_ksg'] = app.$data.data_ksg
                app.$data.history['data_ksg2'] = app.$data.data_ksg2
                formData.append('history', JSON.stringify(app.$data.history))
                formData.append('type', 'save')

                fetch('', {
                    method: 'POST',
                    body: formData,
                    // headers: {
                    //     "X-CSRFToken": (document.cookie).split("=")[1]
                    // }
                })
                    .then(response => response.json())
                    .then(data => {
                        location.reload()
                    })



                setTimeout(() => {
                    let an_rem = document.getElementById("an_rem")
                    an_rem.setAttribute("style", "display:none")
                    document.getElementById("inp_search_history").focus()
                }, 500)

                document.getElementById("model_close").click()
            }


            if (protocols.childNodes.length > 0) {
                let iserr = confirm("Сохранить историю с ошибками?")
                let ch = protocols.childNodes
                for (let c = 0; ch.length > c; c++) {
                    app.$data.history.err_text += ',' + ch[c].innerHTML
                }
                if (iserr) {
                    app.$data.history.err = true
                    let formData = new FormData()
                    app.$data.history['data_ksg'] = app.$data.data_ksg
                    app.$data.history['data_ksg2'] = app.$data.data_ksg2
                    formData.append('history', JSON.stringify(app.$data.history))
                    formData.append('type', 'save')

                    fetch('', {
                        method: 'POST',
                        body: formData,
                        // headers: {
                        //     "X-CSRFToken": (document.cookie).split("=")[1]
                        // }
                    })
                        .then(response => response.json())
                        .then(data => {
                            location.reload()
                        })



                    setTimeout(() => {
                        let an_rem = document.getElementById("an_rem")
                        an_rem.setAttribute("style", "display:none")
                        document.getElementById("inp_search_history").focus()
                    }, 500)

                    document.getElementById("model_close").click()

                }
            }



        },

        def_menu: function () {
            this.menu_oper = false
            this.menu_med_dev = false
            this.menu_complication = false
            this.menu_manipulation = false
        },
        Oper_edit_v: function () {
            document.getElementById("list-profile-list_inf_operation").click()
        }
    }
})

function Get_data_cards() {
    let id = this.event.target.getAttribute("id")
    if (app.$data.history.length == 0){
        app.get_data_cards(id)
    }
    app.next_inf_pers_info()
    mask()
    key()
}




function key() {
    $(window).on('keydown', function (e) {
        if (app.$data.menu_oper) {
            let operation_table = document.getElementById("operation_table")
            if (event.keyCode == 45) {
                document.getElementById("add_tr_operation").click()
                let tbody = document.getElementById("inf_operation").querySelector("tbody")
                let count_tr = []
                for (t of tbody.childNodes) {
                    if (t.childNodes[0].childNodes[0].value.length == 0) {
                        count_tr.push(t.childNodes[0].childNodes[0])
                    }
                }
                if (count_tr.length > 1) {
                    for (let t = 0; t < count_tr.length; t++) {
                        if (t != 0) {
                            Oper_delete($(`tr[n="${count_tr[t].getAttribute("n")}"]`)[0].childNodes[0])
                        }
                    }
                }
                $('input[name="dato"]').last().focus()
            }
            if (event.keyCode == 46) {
                if (app.$data.history.oper.length != 0) {
                    let is_delete = confirm("Удалить запись?")
                    if (is_delete) {
                        Oper_delete($(`tr[n="${event.target.getAttribute("n")}"]`)[0].childNodes[0])
                        $('td[name="dato"] input').last().focus()
                    }
                }

            }
        }
        if (app.$data.menu_med_dev) {
            if (event.keyCode == 45) {
                document.getElementById("add_tr_med_dev").click()

                let tbody = document.getElementById("med_dev_table").querySelector("tbody")
                let count_tr = []
                for (t of tbody.childNodes) {
                    if (t.childNodes[0].childNodes[0].value.length == 0) {
                        count_tr.push(t.childNodes[0].childNodes[0])
                    }
                }
                if (count_tr.length > 1) {
                    for (let t = 0; t < count_tr.length; t++) {
                        if (t != 0) {
                            Med_dev_delete($(`tr[n="${count_tr[t].getAttribute("n")}"]`)[0].childNodes[0])
                        }
                    }
                }


                $('input[name="date"]').last().focus()
            }
            if (event.keyCode == 46) {
                if (app.$data.history.med_dev.length != 0) {
                    let is_delete = confirm("Удалить запись?")
                    if (is_delete) {
                        Med_dev_delete($(`tr[n="${event.target.getAttribute("n")}"]`)[0].childNodes[0])
                        $('td[name="date"] input').last().focus()
                    }
                }

            }
        }

        if (app.$data.menu_complication) {
            if (event.keyCode == 45) {
                document.getElementById("add_tr_complication").click()

                let tbody = document.getElementById("complication_table").querySelector("tbody")
                let count_tr = []
                for (t of tbody.childNodes) {
                    if (t.childNodes[0].childNodes[0].value.length == 0) {
                        count_tr.push(t.childNodes[0].childNodes[0])
                    }
                }
                if (count_tr.length > 1) {
                    for (let t = 0; t < count_tr.length; t++) {
                        if (t != 0) {
                            Complication_delete($(`tr[n="${count_tr[t].getAttribute("tr")}"]`)[0].childNodes[0])
                        }
                    }
                }

                $('select[name="inf_oper"]').last().focus()
            }
            if (event.keyCode == 46) {
                if (app.$data.history.oslo.length != 0) {
                    let is_delete = confirm("Удалить запись?")
                    if (is_delete) {
                        Complication_delete($(`tr[n="${event.target.getAttribute("tr")}"]`)[0].childNodes[0])
                        $('select[name="inf_oper"]').last().focus()
                    }
                }
            }
        }

        if (app.$data.menu_manipulation) {
            if (event.keyCode == 45) {
                document.getElementById("add_tr_manipulation").click()

                let tbody = document.getElementById("manipulation_table").querySelector("tbody")
                let count_tr = []
                for (t of tbody.childNodes) {
                    if (t.childNodes[0].childNodes[0].value.length == 0) {
                        count_tr.push(t.childNodes[0].childNodes[0])
                    }
                }
                if (count_tr.length > 1) {
                    for (let t = 0; t < count_tr.length; t++) {
                        if (t != 0) {
                            Manipulation_delete($(`tr[n="${count_tr[t].getAttribute("tr")}"]`)[0].childNodes[0])
                        }
                    }
                }

                $('input[name="datm"]').last().focus()
            }
            if (event.keyCode == 46) {
                if (app.$data.history.manipulation.length != 0) {
                    let is_delete = confirm("Удалить запись?")
                    if (is_delete) {
                        Manipulation_delete($(`tr[n="${event.target.getAttribute("tr")}"]`)[0].childNodes[0])
                        $('input[name="datm"]').last().focus()
                    }
                }
            }
        }

        next_tab()
        let inf_complication = document.getElementById("inf_complication")
        if (inf_complication.classList.contains('active')) {
            let complication_table = document.getElementById("complication_table")
            if (complication_table) {

                // if (event.keyCode == 45) {
                //     // Complication_add()
                //     document.getElementById("add_tr_complication").click()
                //     $('select[name="inf_oper"]').last().focus()
                // }
                // if (event.keyCode == 46) {
                //     if (app.$data.history.oslo.length != 0) {
                //         let is_delete = confirm("Удалить запись?")
                //         if(is_delete){
                //             Complication_delete($(`tr[n="${event.target.getAttribute("tr")}"]`)[0].childNodes[0])
                //             $('select[name="inf_oper"]').last().focus()
                //         }
                //     }
                // }
            }
        }
        let inf_manipulation = document.getElementById("inf_manipulation")
        if (inf_manipulation.classList.contains('active')) {
            let manipulation_table = document.getElementById("manipulation_table")
            if (manipulation_table) {
                // if (event.keyCode == 45) {
                //     document.getElementById("add_tr_manipulation").click()
                //     $('input[name="datm"]').last().focus()
                // }
                // if (event.keyCode == 46) {
                //     if (app.$data.history.manipulation.length != 0) {
                //         let is_delete = confirm("Удалить запись?")
                //         if(is_delete){
                //             Manipulation_delete($(`tr[n="${event.target.getAttribute("tr")}"]`)[0].childNodes[0])
                //             $('input[name="datm"]').last().focus()
                //         }
                //     }
                // }
            }
        }

        if (event.keyCode == 36) {
            document.getElementById("save").click()
        }
        if (event.keyCode == 35) {
            document.getElementById("save").click()
        }

        if (document.getElementById("list-home-list_inf_pers_info").classList.contains('active')) {

            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-home-list_inf_pers_info")) {
                next_tab()
            }

            if (event.keyCode == 19) {
                let header_left = $(".header-left").find('input[type=text]')
                let header_right = $(".header-right").find('input[type=text]')
                for (left of header_left) {
                    left.blur()
                }
                for (right of header_right) {
                    right.blur()
                }
                let pers = $("#inf_pers_info").find('input[type=text]')
                for (p of pers) {
                    p.blur()
                }



            }

            if (event.target.id == "fam") {
                if (event.keyCode == 13) {
                    $("#im").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.fam = ""
                }
            }
            else if (event.target.id == "im") {
                if (event.keyCode == 13) {
                    $("#ot").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.im = ""
                }
                if (event.keyCode == 33) {
                    $("#fam").focus()
                }
            }
            else if (event.target.id == "ot") {
                if (event.keyCode == 13) {
                    $("#pol").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.ot = ""
                }
                if (event.keyCode == 33) {
                    $("#im").focus()
                }
            }

            else if (event.target.id == "pol") {
                if (event.keyCode == 13) {
                    $("#datp").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.pol = ""
                }
                if (event.keyCode == 33) {
                    $("#ot").focus()
                }
            }

            else if (event.target.id == "datp") {
                if (event.keyCode == 13) {
                    $("#tm_otd").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.datp = ""
                }
                if (event.keyCode == 33) {
                    $("#pol").focus()
                }
            }

            else if (event.target.id == "tm_otd") {
                if (event.keyCode == 13) {
                    // console.log(document.getElementById("otd-l").getAttribute())
                    $("#datv").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.tm_otd = ""
                }
                if (event.keyCode == 33) {
                    $("#datp").focus()
                }
            }

            else if (event.target.id == "datv") {
                if (event.keyCode == 13) {
                    $("#datr").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.datv = ""
                }
                if (event.keyCode == 33) {
                    $("#tm_otd").focus()
                }
            }

            else if (event.target.id == "datr") {
                if (event.keyCode == 13) {
                    $("#otd").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.datr = ""
                }
                if (event.keyCode == 33) {
                    $("#datv").focus()
                }
            }

            else if (event.target.id == "otd") {
                if (event.keyCode == 13) {
                    // app.update_vra_list_otd()
                    $("#vec").focus()

                }
                if (event.keyCode == 46) {
                    app.$data.history.otd = ""
                }
                if (event.keyCode == 33) {
                    $("#datr").focus()
                }
            }

            else if (event.target.id == "vec") {
                if (event.keyCode == 13) {
                    // $("#m_roj_1").focus()
                    document.getElementById("list-profile-list_inf_adr").click()
                }
                if (event.keyCode == 33) {
                    $("#otd").focus()
                }
            }

            else if (event.target.id == "m_roj_1") {
                if (event.keyCode == 33) {
                    $("#vec").focus()
                }
            }

            else if (event.target.id == "adr_in") {
                if (event.keyCode == 13) {
                    $("#rab").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.adr_in = ""
                    document.getElementById("adr_in").value = ""
                }
                if (event.keyCode == 33) {
                    $("#m_roj_1").focus()
                }
            }

            else if (event.target.id == "rab") {
                if (event.keyCode == 13) {
                    $("#prof").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.rab = ""
                }
                if (event.keyCode == 33) {
                    $("#adr_in").focus()
                }
            }

            else if (event.target.id == "prof") {
                if (event.keyCode == 13) {
                    $("#r_n").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.prof = ""
                }
                if (event.keyCode == 33) {
                    $("#rab").focus()
                }
            }

            else if (event.target.id == "r_n") {
                if (event.keyCode == 13) {
                    $("#in_t").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.r_n = ""
                }
                if (event.keyCode == 33) {
                    $("#prof").focus()
                }
            }

            else if (event.target.id == "in_t") {
                if (event.keyCode == 13) {
                    $("#lpy").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.in_t = ""
                }
                if (event.keyCode == 33) {
                    $("#r_n").focus()
                }
            }

            else if (event.target.id == "lpy") {
                if (event.keyCode == 13) {
                    $("#npr_num").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.lpy = ""
                }
                if (event.keyCode == 33) {
                    $("#in_t").focus()
                }
            }

            else if (event.target.id == "npr_num") {
                if (event.keyCode == 13) {
                    $("#npr_date").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.npr_num = ""
                }
                if (event.keyCode == 33) {
                    $("#lpy").focus()
                }
            }

            else if (event.target.id == "npr_date") {
                if (event.keyCode == 13) {
                    $("#alg").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.npr_date = ""
                }
                if (event.keyCode == 33) {
                    $("#npr_num").focus()
                }
            }

            else if (event.target.id == "alg") {
                if (event.keyCode == 13) {
                    $("#goc").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.alg = ""
                }
                if (event.keyCode == 33) {
                    $("#npr_date").focus()
                }
            }

            else if (event.target.id == "goc") {
                if (event.keyCode == 13) {
                    $("#prpg").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.goc = ""
                }
                if (event.keyCode == 33) {
                    $("#alg").focus()
                }
            }

            else if (event.target.id == "prpg") {
                if (event.keyCode == 13) {
                    $("#vrez").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.prpg = ""
                }
                if (event.keyCode == 33) {
                    $("#goc").focus()
                }
            }

            else if (event.target.id == "vrez") {
                if (event.keyCode == 13) {
                    $("#p_per").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.vrez = ""
                }
                if (event.keyCode == 33) {
                    $("#prpg").focus()
                }
            }

            else if (event.target.id == "p_per") {
                if (event.keyCode == 13) {
                    app.next_inf_diagnoses()
                }
                if (event.keyCode == 46) {
                    app.$data.history.p_per = ""
                }
                if (event.keyCode == 33) {
                    $("#vrez").focus()
                }
            }

        }

        if (document.getElementById("list-profile-list_inf_diagnoses").classList.contains('active')) {
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_diagnoses")) {
                next_tab()
            }
            if (event.keyCode == 19) {
                let diagnoses = $("#inf_diagnoses").find('input[type=text]')
                for (d of diagnoses) {
                    d.blur()
                }
            }


            if (event.target.id == "dsny_kod") {
                if (event.keyCode == 13) {
                    $("#ds_0_kod").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.dsny.kod = ""
                    app.$data.history.dsny.naim = ""

                }
            }
            else if (event.target.id == "ds_0_kod") {
                if (event.keyCode == 13) {
                    $("#dsk_kod").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.ds_0.kod = ""
                    app.$data.history.ds_0.naim = ""
                }
                if (event.keyCode == 33) {
                    $("#dsny_kod").focus()
                }
            }

            else if (event.target.id == "dsk_kod") {
                if (event.keyCode == 13) {
                    $("#dskz_kod").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.dsk.kod = ""
                    app.$data.history.dsk.naim = ""

                }
                if (event.keyCode == 33) {
                    $("#ds_0_kod").focus()
                }
            }

            else if (event.target.id == "dskz_kod") {
                if (event.keyCode == 13) {
                    $("#ds_osl_kod").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.dskz.kod = ""
                    app.$data.history.dskz.naim = ""
                }
                if (event.keyCode == 33) {
                    $("#dsk_kod").focus()
                }
            }

            else if (event.target.id == "ds_osl_kod") {
                if (event.keyCode == 13) {
                    $("#dsc_kod").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.ds_osl.kod = ""
                    app.$data.history.ds_osl.naim = ""
                }
                if (event.keyCode == 33) {
                    $("#dskz_kod").focus()
                }
            }

            else if (event.target.id == "dsc_kod") {
                if (event.keyCode == 13) {
                    $("#dson_kod").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.dsc.kod = ""
                    app.$data.history.dsc.naim = ""
                }
                if (event.keyCode == 33) {
                    $("#ds_osl_kod").focus()
                }
            }

            else if (event.target.id == "dson_kod") {
                if (event.keyCode == 13) {
                    $("#dat_otd").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.dson.kod = ""
                    app.$data.history.dson.naim = ""
                }
                if (event.keyCode == 33) {
                    $("#dsc_kod").focus()
                }
            }

            else if (event.target.id == "dat_otd") {
                if (event.keyCode == 13) {
                    $("#tm_otd_d").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.dat_otd = ""
                }
                if (event.keyCode == 33) {
                    $("#dson_kod").focus()
                }
            }

            else if (event.target.id == "tm_otd_d") {
                if (event.keyCode == 13) {
                    $("#icx").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.tm_otd_d = ""
                }
                if (event.keyCode == 33) {
                    $("#dat_otd").focus()
                }
            }

            else if (event.target.id == "icx") {
                if (event.keyCode == 13) {
                    $("#rslt").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.icx = ""
                }
                if (event.keyCode == 33) {
                    $("#tm_otd_d").focus()
                }
            }

            else if (event.target.id == "rslt") {
                if (event.keyCode == 13) {
                    app.next_tabs()
                }
                if (event.keyCode == 46) {
                    app.$data.history.rslt = ""
                }
                if (event.keyCode == 33) {
                    $("#icx").focus()
                }
            }

        }


        if (document.getElementById("list-profile-list_inf_koyko").classList.contains('active')) {

            // console.log(event.keyCode)
            if (event.keyCode == 19) {
                document.getElementById("list-profile-list_inf_policy_passport_snills").click()
            }

            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_koyko")) {
                next_tab()
            }

            // if (event.keyCode == 27){
            //     app.next_inf_operation()
            // }

            if (event.keyCode == 45) {
                Koyko_add()
                $('input[name="N"]').focus()


            }
            // if (event.keyCode == 46) {
            //     if (event.target.id != "aro_n" && event.target.id != "aro_let"
            //         && event.target.id != "aro_sofa" && event.target.id != "aro_ivl") {
            //         if (app.$data.history.le_vr.length != 0) {
            //             let tbody = document.getElementById('koyko_table').querySelector('tbody')
            //             tbody.innerHTML = ''
            //             app.$data.history.le_vr = []
            //         }
            //     }
            // }

            if (event.target.name == "N") {
                if (event.keyCode == 13) {
                    $('input[name="aro"]').focus()
                }
                if (event.keyCode == 8) {
                    $('input[name="N"]').val("")
                }
            }
            else if (event.target.name == "aro") {
                if (event.keyCode == 13) {
                    $('input[name="otd"]').focus()
                }
                if (event.keyCode == 8) {
                    $('input[name="aro"]').val("")
                }
            }

            else if (event.target.name == "otd") {
                if (event.keyCode == 13) {
                    $('input[name="prof_k"]').focus()
                }
                if (event.keyCode == 8) {
                    $('input[name="otd"]').val("")
                }
            }

            else if (event.target.name == "prof_k") {
                if (event.keyCode == 13) {
                    $('input[name="kod"]').focus()
                }
                if (event.keyCode == 8) {
                    $('input[name="prof_k"]').val("")
                }
            }

            else if (event.target.name == "kod") {

                if (event.keyCode == 13) {
                    if (app.$data.history.le_vr.aro.length > 0) {
                        $('#aro_n').focus()
                    }
                    else {
                        $('input[name="N"]').focus()
                    }
                }
                if (event.keyCode == 8) {
                    $('input[name="kod"]').val("")
                }
            }
            else if (event.target.id == "aro_n") {
                if (event.keyCode == 13) {
                    $('#aro_let').focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.le_vr.aro_n = ""
                }
            }
            else if (event.target.id == "aro_let") {
                if (event.keyCode == 13) {
                    $('#aro_sofa').focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.le_vr.aro_let = ""
                }
                if (event.keyCode == 33) {
                    $("#aro_n").focus()
                }
            }
            else if (event.target.id == "aro_sofa") {
                if (event.keyCode == 13) {
                    $('#aro_ivl').focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.le_vr.aro_sofa = ""
                }
                if (event.keyCode == 33) {
                    $("#aro_let").focus()
                }
            }
            else if (event.target.id == "aro_ivl") {
                if (event.keyCode == 13) {
                    $('input[name="N"]').focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.le_vr.aro_ivl = ""
                }
                if (event.keyCode == 33) {
                    $("#aro_sofa").focus()
                }
            }




            // if ((event.keyCode == 13) && (event.target.name !="N" || event.target.name!="aro" || event.target.name != "otd"
            // ||event.target.name!= "prof_k" )) {
            //     if (app.$data.history.le_vr.length != 0) {
            //         Koyko_edit()
            //         $('input[name="N"]').focus()
            //     }
            // }


            // input.value != '0' && input.value != ''
        }

        if (document.getElementById("list-profile-list_inf_operation").classList.contains('active')) {

            let scrol = document.getElementById("inf_operation")

            // let operation_table = document.getElementById("operation_table")
            // if (event.keyCode == 45) {
            //     document.getElementById("add_tr_operation").click()
            //     $('input[name="dato"]').last().focus()
            // }
            // if (event.keyCode == 46) {
            //     if (app.$data.history.oper.length != 0) {
            //         let is_delete = confirm("Удалить запись?")
            //         if(is_delete){
            //             Oper_delete($(`tr[n="${event.target.getAttribute("n")}"]`)[0].childNodes[0])
            //             $('td[name="dato"] input').last().focus()
            //         }
            //     }

            // }

            if (event.keyCode == 19) {
                document.getElementById("list-profile-list_inf_ks_zabolev").click()
            }
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_operation")) {
                next_tab()
            }

            if ((event.keyCode == 13)) {
                if (app.$data.history.le_vr.oper != 0) {
                    if (event.target.type == undefined) {
                        $('td[name="dato"] input').first().focus()
                        document.getElementById("inf_operation").scrollLeft = 0
                    }
                }
            }

            if ((event.keyCode == 13) && (event.target.id != "staticBackdrop" || event.target.id != "list-profile-list_inf_operation")) {
                let el = event.target

                if (el.name == "dato") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="tm_o"]`).focus()
                }
                else if (el.name == "tm_o") {
                    $("#operation_table").find(`select[n="${parseInt(el.getAttribute("n"), 10)}"][name="py"]`).focus()
                }
                else if (el.name == "py") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="kod_op"]`).focus()

                }
                else if (el.name == "kod_op") {
                    $("#operation_table").find(`select[n="${parseInt(el.getAttribute("n"), 10)}"][name="goc"]`).focus()
                    // document.getElementById("inf_operation").scrollLeft += 600;

                }
                else if (el.name == "goc") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="kodx"]`).focus()
                    // scrol.scrollLeft = 400
                    // setTimeout(() => {
                    //     scrol.scrollLeft = 400
                    // }, 20)


                }
                else if (el.name == "kodx") {
                    $("#operation_table").find(`select[n="${parseInt(el.getAttribute("n"), 10)}"][name="pop"]`).focus()
                    document.getElementById("inf_operation").scrollLeft = 1200;
                    // setTimeout(() => {
                    //     // document.getElementById("inf_operation").scrollLeft = 600
                    //     // window.scrollLeft = 600
                    //     // console.log(scrol)
                    //     // scrol.scroll(0,100)
                    // }, 20)

                }
                else if (el.name == "pop") {
                    // document.getElementById("inf_operation").scrollLeft += 600;
                    // $("#operation_table").find(`div[n="${parseInt(el.getAttribute("n"), 10)}"][name="pr_osob"]`).focus()
                    let pr_osob = $("#operation_table").find(`div[n="${parseInt(el.getAttribute("n"), 10)}"][name="pr_osob"]`)
                    pr_osob[0].childNodes[0].childNodes[0].focus()
                    // window.screenLeft = 1200
                    // scrol.scroll(600,1200)
                    // scrol.scrollLeft = 600
                    // setTimeout(() => {
                    //     scrol.scrollLeft = 700
                    // }, 20)

                }
                else if (el.name == "pr_osob") {
                    // document.getElementById("inf_operation").scrollLeft += 600;
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="k_mm"]`).focus()
                    // scrol.scroll(600,1200)
                    // scrol.scrollLeft = 600
                    // setTimeout(() => {
                    //     scrol.scrollLeft = 900
                    // }, 20)
                }
                else if (el.name == "k_mm") {
                    // document.getElementById("inf_operation").scrollLeft += 600;
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="kodxa"]`).focus()
                    // scrol.scrollLeft = 600
                    // setTimeout(() => {
                    //     scrol.scrollLeft = 1200
                    // }, 20)
                }
                else if (el.name == "kodxa") {
                    // document.getElementById("inf_operation").scrollLeft += 600;
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="kodxa1"]`).focus()
                    // scrol.scrollLeft = 600
                    // setTimeout(() => {
                    //     scrol.scrollLeft = 1200
                    // }, 20)
                }
                else if (el.name == "kodxa1") {
                    // document.getElementById("inf_operation").scrollLeft += 600;
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="obz"]`).focus()
                    // scrol.scrollLeft = 600
                    // setTimeout(() => {
                    //     scrol.scrollLeft = 1200
                    // }, 20)
                }
                else if (el.name == "obz") {
                    // document.getElementById("inf_operation").scrollLeft += 600;
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="obz_2"]`).focus()
                    // scrol.scrollLeft = 600
                    // setTimeout(() => {
                    //     scrol.scrollLeft = 1200
                    // }, 20)
                }
                else if (el.name == "obz_2") {
                    // document.getElementById("inf_operation").scrollLeft += 600;
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="kodan"]`).focus()
                    // scrol.scrollLeft = 600
                    // setTimeout(() => {
                    //     scrol.scrollLeft = 1200
                    // }, 20)
                }
                else if (el.name == "kodan") {
                    // document.getElementById("inf_operation").scrollLeft += 600;
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="dato"]`).focus()
                    // scrol.scrollLeft = 600
                    // setTimeout(() => {
                    //     scrol.scrollLeft = 0
                    // }, 20)
                }

            }
            if ((event.keyCode == 8) && (event.target.id != "staticBackdrop" || event.target.id != "list-profile-list_inf_operation")) {
                let el = event.target

                if (el.name == "dato") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="dato"]`).val("")
                }
                else if (el.name == "tm_o") {
                    $("#operation_table").find(`select[n="${parseInt(el.getAttribute("n"), 10)}"][name="tm_o"]`).val("")
                }
                else if (el.name == "py") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="py"]`).val("")
                }
                else if (el.name == "kod_op") {
                    $("#operation_table").find(`select[n="${parseInt(el.getAttribute("n"), 10)}"][name="kod_op"]`).val("")
                }
                else if (el.name == "goc") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="goc"]`).val("")
                }
                else if (el.name == "kodx") {
                    $("#operation_table").find(`select[n="${parseInt(el.getAttribute("n"), 10)}"][name="kodx"]`).val("")
                }
                else if (el.name == "pop") {
                    $("#operation_table").find(`select[n="${parseInt(el.getAttribute("n"), 10)}"][name="pop"]`).val("")
                }
                else if (el.name == "pr_osob") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="pr_osob"]`).val("")
                }
                else if (el.name == "k_mm") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="k_mm"]`).val("")
                }
                else if (el.name == "kodxa") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="kodxa"]`).val("")
                }
                else if (el.name == "kodxa1") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="kodxa1"]`).val("")
                }
                else if (el.name == "obz") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="obz"]`).val("")
                }
                else if (el.name == "obz_2") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="obz_2"]`).val("")
                }
                else if (el.name == "kodan") {
                    $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="kodan"]`).val("")
                }

            }
            // if (event.keyCode == 46) {
            //     if (app.$data.history.oper.length != 0) {
            //         Oper_delete($(`tr[n="${event.target.getAttribute("n")}"]`)[0].childNodes[0])
            //         $('td[name="dato"] input').last().focus()
            //     }

            // }
            if (event.keyCode == 33) {
                if (app.$data.history.le_vr.oper != 0) {
                    let el = event.target
                    if (el.name != "pr_osob") {
                        let inp = $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10) - 1}"][name="${el.getAttribute("name")}"]`)
                        if (inp.length != 0) {
                            inp[0].focus()
                        }
                        else {
                            let inp = $("#operation_table").find(`select[n="${parseInt(el.getAttribute("n"), 10) - 1}"][name="${el.getAttribute("name")}"]`)
                            if (inp.length != 0) {
                                inp[0].focus()
                            }
                        }
                    }
                    else {
                        let inp = $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="${el.getAttribute("name")}"][nn="${el.getAttribute("nn")}"]`)
                        if (inp[0].getAttribute("nn") != "0") {
                            $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="${el.getAttribute("name")}"][nn="${parseInt(el.getAttribute("nn"), 10) - 1}"]`)[0].focus()
                        }
                        else {
                            $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="${el.getAttribute("name")}"][nn="${parseInt(el.getAttribute("nn"), 10) + 8}"]`)[0].focus()
                        }
                    }

                }
            }
            if (event.keyCode == 34) {
                if (app.$data.history.le_vr.oper != 0) {
                    let el = event.target
                    if (el.name != "pr_osob") {
                        let inp = $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10) + 1}"][name="${el.getAttribute("name")}"]`)
                        if (inp.length != 0) {
                            inp[0].focus()
                        }
                        else {
                            let inp = $("#operation_table").find(`select[n="${parseInt(el.getAttribute("n"), 10) + 1}"][name="${el.getAttribute("name")}"]`)
                            if (inp.length != 0) {
                                inp[0].focus()
                            }
                        }
                    }
                    else {
                        let inp = $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="${el.getAttribute("name")}"][nn="${el.getAttribute("nn")}"]`)
                        if (inp[0].getAttribute("nn") != "8") {
                            $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="${el.getAttribute("name")}"][nn="${parseInt(el.getAttribute("nn"), 10) + 1}"]`)[0].focus()
                        }
                        else {
                            $("#operation_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="${el.getAttribute("name")}"][nn="${parseInt(el.getAttribute("nn"), 10) - 8}"]`)[0].focus()
                        }
                    }

                }
            }


        }
        if (document.getElementById("list-profile-list_inf_med_dev").classList.contains('active')) {
            let scrol = document.getElementById("inf_med_dev")

            // if (event.keyCode == 45) {
            //     document.getElementById("add_tr_med_dev").click()
            //     $('input[name="date"]').last().focus()
            // }
            // if (event.keyCode == 46) {
            //     if (app.$data.history.med_dev.length != 0) {
            //         let is_delete = confirm("Удалить запись?")
            //         if(is_delete){
            //             Med_dev_delete($(`tr[n="${event.target.getAttribute("n")}"]`)[0].childNodes[0])
            //             $('td[name="date"] input').last().focus()
            //         }
            //     }

            // }

            if ((event.keyCode == 13)) {
                if (app.$data.history.med_dev != 0) {
                    $('td[name="date"] input').first().focus()
                }
            }
            if ((event.keyCode == 13) && (event.target.id != "staticBackdrop" || event.target.id != "list-profile-list_inf_med_dev")) {
                let el = event.target
                if (el.name == "date") {
                    $("#med_dev_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="code"]`).focus()
                }
                else if (el.name == "code") {
                    $("#med_dev_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="number_ser"]`).focus()
                }
                else if (el.name == "number_ser") {
                    $("#med_dev_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="date"]`).focus()

                }

            }
            if ((event.keyCode == 8) && (event.target.id != "staticBackdrop" || event.target.id != "list-profile-list_inf_med_dev")) {
                let el = event.target
                if (el.name == "date") {
                    $("#med_dev_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="date"]`).val("")
                }
                else if (el.name == "code") {
                    $("#med_dev_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="code"]`).val("")
                }
                else if (el.name == "number") {
                    $("#med_dev_table").find(`input[n="${parseInt(el.getAttribute("n"), 10)}"][name="number"]`).val("")
                }

            }

            if (event.keyCode == 33) {
                if (app.$data.history.le_vr.med_dev != 0) {
                    let el = event.target

                    let inp = $("#med_dev_table").find(`input[n="${parseInt(el.getAttribute("n"), 10) - 1}"][name="${el.getAttribute("name")}"]`)
                    if (inp.length != 0) {
                        inp[0].focus()
                    }
                }
            }
            if (event.keyCode == 34) {
                if (app.$data.history.le_vr.med_dev != 0) {
                    let el = event.target
                    let inp = $("#med_dev_table").find(`input[n="${parseInt(el.getAttribute("n"), 10) + 1}"][name="${el.getAttribute("name")}"]`)
                    if (inp.length != 0) {
                        inp[0].focus()
                    }

                }
            }
        }
        if (document.getElementById("list-profile-list_inf_ks_zabolev").classList.contains('active')) {
            // let ksg_osn = document.getElementById("ksg_osn")
            // let ksg_sop = document.getElementById("ksg_sop")
            // var vds = document.getElementById("vds")
            // console.log(vds)
            // if ($("#vds").val().length == 0){
            //     ksg_osn.setAttribute("disabled","disabled")
            //     ksg_sop.setAttribute("disabled","disabled")
            // }
            // else{
            //     ksg_osn.removeAttribute("disabled")
            //     ksg_sop.removeAttribute("disabled")
            // }

            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_ks_zabolev")) {
                next_tab()
            }
            if (event.keyCode == 19) {
                let ks_zabolev = $("#inf_ks_zabolev").find('input[type=text]')
                for (ks of ks_zabolev) {
                    ks.blur()
                }
            }
            if (app.history.vds != 'ВТМП баз.программа ОМС' && app.history.vds != 'ВТМП сверхбаз.программа') {
                if (event.target.id == "ksg_osn") {
                    if (event.keyCode == 13) {
                        $("#dskz2_kod").focus()
                    }
                    if (event.keyCode == 46) {
                        app.$data.history.ksg_osn = ""
                    }

                }

                else if (event.target.id == "dskz2_kod") {
                    if (event.keyCode == 13) {
                        $("#oopkk").focus()
                    }
                    if (event.keyCode == 46) {
                        app.$data.history.dskz2.kod = ""
                    }
                    if (event.keyCode == 33) {
                        $("#ksg_osn").focus()
                    }
                }

                else if (event.target.id == "oopkk") {
                    if (event.keyCode == 13) {
                        $("#ksg_sop").focus()
                    }
                    if (event.keyCode == 46) {
                        app.$data.history.oopkk = ""
                    }
                    if (event.keyCode == 33) {
                        $("#dskz2_kod").focus()
                    }
                }
                else if (event.target.id == "ksg_sop") {
                    if (event.keyCode == 13) {
                        $("#iddoc").focus()
                    }
                    if (event.keyCode == 46) {
                        app.$data.history.ksg_sop = ""
                    }
                    if (event.keyCode == 33) {
                        $("#oopkk").focus()
                    }
                }
                else if (event.target.id == "iddoc") {
                    if (event.keyCode == 13) {
                        $("#dskz3_kod").focus()
                    }
                    if (event.keyCode == 46) {
                        app.$data.history.iddoc = ""
                    }
                    if (event.keyCode == 33) {
                        $("#ksg_sop").focus()
                    }
                }
                else if (event.target.id == "dskz3_kod") {
                    if (event.keyCode == 13) {
                        $("#ksg_osn2").focus()
                    }
                    if (event.keyCode == 46) {
                        app.$data.history.dskz3.kod = ""
                    }
                    if (event.keyCode == 33) {
                        $("#iddoc").focus()
                    }
                }

                else if (event.target.id == "ksg_osn2") {
                    if (event.keyCode == 13) {
                        $("#oopkk2").focus()
                    }
                    if (event.keyCode == 46) {
                        app.$data.history.ksg_osn2 = ""
                    }
                    if (event.keyCode == 33) {
                        $("#dskz3_kod").focus()
                    }
                }
                else if (event.target.id == "oopkk2") {
                    if (event.keyCode == 46) {
                        app.$data.history.oopkk2 = ""
                    }
                    if (event.keyCode == 33) {
                        $("#ksg_osn2").focus()
                    }
                }
            }
            else {
                if (event.target.id == "metod_hmp") {
                    if (event.keyCode == 13) {
                        $("#vid_hmp").focus()
                    }
                    if (event.keyCode == 46) {
                        app.$data.history.metod_hmp = ""
                    }
                }
                if (event.target.id == "vid_hmp") {
                    if (event.keyCode == 46) {
                        app.$data.history.vid_hmp = ""
                    }
                }

            }
        }

        if (document.getElementById("list-profile-list_inf_complication").classList.contains('active')) {
            if (event.keyCode == 19) {
                document.getElementById("list-profile-list_inf_complication").click()
            }

            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_complication")) {
                next_tab()
            }

            if ((event.keyCode == 13) && (event.target.id == "staticBackdrop" || event.target.id == "list-profile-list_inf_complication")) {
                $('select[name="inf_oper"]').first().focus()
            }

            if ((event.keyCode == 13) && (event.target.id != "staticBackdrop" || event.target.id != "list-profile-list_inf_complication")) {
                let el = event.target

                if (el.name == "inf_oper") {
                    $("#complication_table").find(`input[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="tnvr"]`).focus()
                }
                else if (el.name == "tnvr") {
                    $("#complication_table").find(`input[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="dato"]`).focus()
                }
                else if (el.name == "dato") {
                    $("#complication_table").find(`input[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="osl"]`).focus()
                }
                else if (el.name == "osl") {
                    $("#complication_table").find(`select[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="xosl"]`).focus()
                }
                else if (el.name == "xosl") {
                    $("#complication_table").find(`select[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="posl"]`).focus()
                }
                else if (el.name == "posl") {
                    $("#complication_table").find(`select[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="aosl"]`).focus()
                }
                else if (el.name == "aosl") {
                    $("#complication_table").find(`select[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="inf_oper"]`).focus()
                }
            }


            // if (event.keyCode == 45) {
            //     // Complication_add()
            //     document.getElementById("add_tr_complication").click()
            //     // $('select[name="inf_oper"]').last().focus()
            // }
            // if (event.keyCode == 46) {
            //     if (app.$data.history.oslo.length != 0) {
            //         Complication_delete($(`tr[n="${event.target.getAttribute("tr")}"]`)[0].childNodes[0])
            //         $('select[name="inf_oper"]').last().focus()
            //     }
            // }

            if (event.keyCode == 33) {
                let el = event.target
                let inp = $("#complication_table").find(`input[tr="${parseInt(el.getAttribute("tr"), 10) - 1}"][name="${el.getAttribute("name")}"]`)
                if (inp.length != 0) {
                    inp[0].focus()
                }
                else {
                    let inp = $("#complication_table").find(`select[tr="${parseInt(el.getAttribute("tr"), 10) - 1}"][name="${el.getAttribute("name")}"]`)
                    if (inp.length != 0) {
                        inp[0].focus()
                    }
                }

            }

            if (event.keyCode == 34) {
                let el = event.target
                let inp = $("#complication_table").find(`input[tr="${parseInt(el.getAttribute("tr"), 10) + 1}"][name="${el.getAttribute("name")}"]`)
                if (inp.length != 0) {
                    inp[0].focus()
                }
                else {
                    let inp = $("#complication_table").find(`select[tr="${parseInt(el.getAttribute("tr"), 10) + 1}"][name="${el.getAttribute("name")}"]`)
                    if (inp.length != 0) {
                        inp[0].focus()
                    }
                }
            }
        }

        if (document.getElementById("list-profile-list_inf_work_capacity").classList.contains('active')) {
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_work_capacity")) {
                next_tab()
            }
            if (event.keyCode == 19) {
                // document.getElementById("list-profile-list_inf_work_capacity").click()
            }
        }

        if (document.getElementById("list-profile-list_inf_manipulation").classList.contains('active')) {
            if (event.keyCode == 19) {
                document.getElementById("list-home-list_inf_pers_info").click()
            }
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_manipulation")) {
                next_tab()
            }


            if ((event.keyCode == 13) && (event.target.id == "staticBackdrop" || event.target.id == "list-profile-list_inf_manipulation")) {
                $('input[name="datm"]').first().focus()
            }

            if ((event.keyCode == 13) && (event.target.id != "staticBackdrop" || event.target.id != "list-profile-list_inf_manipulation")) {
                let el = event.target

                if (el.name == "datm") {
                    $("#manipulation_table").find(`input[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="tnvr"]`).focus()
                }
                else if (el.name == "tnvr") {
                    $("#manipulation_table").find(`input[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="kodmn"]`).focus()
                }
                else if (el.name == "kodmn") {
                    $("#manipulation_table").find(`input[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="kol"]`).focus()
                }
                else if (el.name == "kol") {
                    // $("#manipulation_table").find(`select[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="pl"]`).focus()
                    $("#manipulation_table").find(`input[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="datm"]`).focus()
                }
                // else if (el.name == "pl") {
                //     $("#manipulation_table").find(`input[tr="${parseInt(el.getAttribute("tr"), 10)}"][name="datm"]`).focus()
                // }
            }

            // if (event.keyCode == 45) {
            //     document.getElementById("add_tr_manipulation").click()
            //     // $('input[name="datm"]').last().focus()
            // }
            // if (event.keyCode == 46) {
            //     if (app.$data.history.manipulation.length != 0) {
            //         Manipulation_delete($(`tr[n="${event.target.getAttribute("tr")}"]`)[0].childNodes[0])
            //         $('input[name="datm"]').last().focus()
            //     }
            // }

            if (event.keyCode == 33) {
                let el = event.target
                let inp = $("#manipulation_table").find(`input[tr="${parseInt(el.getAttribute("tr"), 10) - 1}"][name="${el.getAttribute("name")}"]`)
                if (inp.length != 0) {
                    inp[0].focus()
                }
                else {
                    let inp = $("#manipulation_table").find(`select[tr="${parseInt(el.getAttribute("tr"), 10) - 1}"][name="${el.getAttribute("name")}"]`)
                    if (inp.length != 0) {
                        inp[0].focus()
                    }
                }

            }

            if (event.keyCode == 34) {
                let el = event.target
                let inp = $("#manipulation_table").find(`input[tr="${parseInt(el.getAttribute("tr"), 10) + 1}"][name="${el.getAttribute("name")}"]`)
                if (inp.length != 0) {
                    inp[0].focus()
                }
                else {
                    let inp = $("#manipulation_table").find(`select[tr="${parseInt(el.getAttribute("tr"), 10) + 1}"][name="${el.getAttribute("name")}"]`)
                    if (inp.length != 0) {
                        inp[0].focus()
                    }
                }
            }
        }

        if (document.getElementById("list-profile-list_inf_translations").classList.contains('active')) {
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_translations")) {
                next_tab()
            }
            if (event.keyCode == 19) {
                let translations = $("#inf_translations").find('input[type=text]')
                for (t of translations) {
                    t.blur()
                }
            }
            if (event.target.id == "potd") {
                if (event.keyCode == 13) {
                    $("#dat_pe").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.potd = ""
                }
            }
            else if (event.target.id == "dat_pe") {
                if (event.keyCode == 13) {
                    $("#kod_y").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.dat_pe = ""
                }
                if (event.keyCode == 33) {
                    $("#potd").focus()
                }
            }
            else if (event.target.id == "kod_y") {
                if (event.keyCode == 13) {
                    $("#pr_per").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.kod_y = ""
                }
                if (event.keyCode == 33) {
                    $("#dat_pe").focus()
                }
            }
            else if (event.target.id == "pr_per") {
                if (event.keyCode == 46) {
                    app.$data.history.pr_per = ""
                }
                if (event.keyCode == 13) {
                    app.next_inf_koyko()
                }
                if (event.keyCode == 33) {
                    $("#kod_y").focus()
                }
            }


        }

        if (document.getElementById("list-profile-list_inf_post_mortem").classList.contains('active')) {
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_post_mortem")) {
                next_tab()
            }
            if (event.keyCode == 19) {
                let post_mortem = $("#inf_post_mortem").find('input[type=text]')
                for (p of post_mortem) {
                    p.blur()
                }
            }
            if (event.target.id == "wskr_date") {
                if (event.keyCode == 13) {
                    $("#tm_let").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.wskr_date = ""
                }
            }
            else if (event.target.id == "tm_let") {
                if (event.keyCode == 13) {
                    $("#pri").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.tm_let = ""
                }
                if (event.keyCode == 33) {
                    $("#wskr_date").focus()
                }
            }
            else if (event.target.id == "pri") {
                if (event.keyCode == 13) {
                    $("#ds_let_kod").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.pri = ""
                }
                if (event.keyCode == 33) {
                    $("#tm_let").focus()
                }
            }
            else if (event.target.id == "ds_let_kod") {
                if (event.keyCode == 13) {
                    $("#wskr").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.ds_let.kod = ""
                    app.$data.history.ds_let.naim = ""
                }
                if (event.keyCode == 33) {
                    $("#pri").focus()
                }
            }
            else if (event.target.id == "wskr") {
                if (event.keyCode == 13) {
                    $("#dspat_kod").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.wskr = ""
                }
                if (event.keyCode == 33) {
                    $("#ds_let_kod").focus()
                }
            }
            else if (event.target.id == "dspat_kod") {
                if (event.keyCode == 13) {
                    $("#rasxp").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.dspat.kod = ""
                    app.$data.history.dspat.naim = ""
                }
                if (event.keyCode == 33) {
                    $("#wskr").focus()
                }
            }
            else if (event.target.id == "rasxp") {
                if (event.keyCode == 13) {
                    $("#otd_y").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.rasxp = ""
                }
                if (event.keyCode == 33) {
                    $("#dspat_kod").focus()
                }
            }
            else if (event.target.id == "otd_y") {
                if (event.keyCode == 13) {
                    app.next_tabs()
                }
                if (event.keyCode == 46) {
                    app.$data.history.otd_y = ""
                }
                if (event.keyCode == 33) {
                    $("#rasxp").focus()
                }
            }

        }
        if (document.getElementById("list-profile-list_inf_injury").classList.contains('active')) {
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_injury")) {
                next_tab()
            }
            if (event.keyCode == 19) {
                let injury = $("#inf_injury").find('input[type=text]')
                for (i of injury) {
                    i.blur()
                }
            }

            if (event.target.id == "dskz_kod") {
                if (event.keyCode == 13) {
                    $("#details_kod").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.dskz.kod = ""
                    app.$data.history.dskz.naim = ""
                }

            }
            else if (event.target.id == "details_kod") {
                if (event.keyCode == 13) {
                    $("#t_trv").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.details.kod = ""
                    app.$data.history.details.naim = ""
                }
                if (event.keyCode == 33) {
                    $(".dskz_kod").focus()
                }
            }
            else if (event.target.id == "t_trv") {
                if (event.keyCode == 13) {
                    $("#trav_ns").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.t_trv = ""
                }
                if (event.keyCode == 33) {
                    $("#details_kod").focus()
                }
            }
            else if (event.target.id == "trav_ns") {
                if (event.keyCode == 13) {
                    document.getElementById("list-profile-list_inf_koyko").click()
                }
                if (event.keyCode == 46) {
                    app.$data.history.trav_ns = ""
                }
                if (event.keyCode == 33) {
                    $("#t_trv").focus()
                }
            }
        }

        if (document.getElementById("list-profile-list_inf_policy_passport_snills").classList.contains('active')) {
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_policy_passport_snills")) {
                next_tab()
            }
            if (event.keyCode == 19) {
                let p = $("#inf_policy_passport_snills").find('input[type=text]')
                for (s of p) {
                    s.blur()
                }
            }
            if (event.target.id == "vds") {
                if (event.keyCode == 13) {
                    $("#sctp").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.vds = ""
                }
            }
            else if (event.target.id == "sctp") {
                if (event.keyCode == 13) {
                    $("#nctp").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.sctp = ""
                }
                if (event.keyCode == 33) {
                    $("#vds").focus()
                }
            }
            else if (event.target.id == "nctp") {
                if (event.keyCode == 13) {
                    $("#ctkom").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.nctp = ""
                }
                if (event.keyCode == 33) {
                    $("#sctp").focus()
                }
            }
            else if (event.target.id == "ctkom") {
                if (event.keyCode == 13) {
                    $("#t_pol").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.ctkom = ""
                }
                if (event.keyCode == 33) {
                    $("#nctp").focus()
                }
            }
            else if (event.target.id == "t_pol") {
                if (event.keyCode == 13) {
                    $("#udl").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.t_pol = ""
                }
                if (event.keyCode == 33) {
                    $("#ctkom").focus()
                }
            }
            else if (event.target.id == "udl") {
                if (event.keyCode == 13) {
                    $("#s_pasp").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.udl = ""
                }
                if (event.keyCode == 33) {
                    $("#t_pol").focus()
                }
            }
            else if (event.target.id == "s_pasp") {
                if (event.keyCode == 13) {
                    $("#n_pasp").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.s_pasp = ""
                }
                if (event.keyCode == 33) {
                    $("#udl").focus()
                }
            }
            else if (event.target.id == "n_pasp") {
                if (event.keyCode == 13) {
                    $("#docdate").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.n_pasp = ""
                }
                if (event.keyCode == 33) {
                    $("#s_pasp").focus()
                }
            }
            else if (event.target.id == "docdate") {
                if (event.keyCode == 13) {
                    $("#docorg").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.docdate = ""
                }
                if (event.keyCode == 33) {
                    $("#n_pasp").focus()
                }
            }
            else if (event.target.id == "docorg") {
                if (event.keyCode == 13) {
                    $(".m_roj").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.docorg = ""
                }
                if (event.keyCode == 33) {
                    $("#docdate").focus()
                }
            }
            else if (event.target.id == "m_roj") {
                if (event.keyCode == 13) {
                    $("#ss").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.m_roj = ""
                }
                if (event.keyCode == 33) {
                    $("#docorg").focus()
                }
            }
            else if (event.target.id == "ss") {
                if (event.keyCode == 46) {
                    app.$data.history.ss = ""
                }
                if (event.keyCode == 13) {
                    document.getElementById("list-home-list_inf_pers_info").click()

                }
                if (event.keyCode == 33) {
                    $("#m_roj").focus()
                }

            }

        }

        if (document.getElementById("list-profile-list_inf_pregnancy").classList.contains('active')) {
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_pregnancy")) {
                next_tab()
            }
            if (event.keyCode == 19) {
                let preg = $("#inf_pregnancy").find('input[type=text]')
                for (pr of preg) {
                    pr.blur()
                }
            }
            // if (event.target.id == "vb_a_datv") {
            //     if (event.keyCode == 13) {
            //         $("#srber").focus()
            //     }
            //     if (event.keyCode == 46) {
            //         app.$data.history.vb_a_datv = ""
            //     }
            // }
            if (event.target.id == "srber") {
                if (event.keyCode == 13) {
                    $("#n_ber").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.srber = ""
                }
                // if (event.keyCode == 33) {
                //     $("#vb_a_datv").focus()
                // }
            }
            else if (event.target.id == "n_ber") {
                if (event.keyCode == 13) {
                    $("#pria").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.n_ber = ""
                }
                if (event.keyCode == 33) {
                    $("#srber").focus()
                }
            }
            else if (event.target.id == "pria") {
                if (event.keyCode == 13) {
                    $("#m_prer").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.pria = ""
                }
                if (event.keyCode == 33) {
                    $("#n_ber").focus()
                }
            }
            else if (event.target.id == "m_prer") {
                if (event.keyCode == 13) {
                    app.next_tabs()
                }
                if (event.keyCode == 46) {
                    app.$data.history.m_prer = ""
                }
                if (event.keyCode == 33) {
                    $("#pria").focus()
                }
            }
        }

        if (document.getElementById("list-profile-list_inf_disability").classList.contains('active')) {
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_disability")) {
                next_tab()
            }

            if (event.keyCode == 19) {
                let disability = $("#inf_disability").find('input[type=text]')
                for (di of disability) {
                    di.blur()
                }
            }

            if (event.target.id == "dat_l1") {
                if (event.keyCode == 13) {
                    $("#dat_l2").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.dat_l1 = ""
                }
            }
            else if (event.target.id == "dat_l2") {
                if (event.keyCode == 13) {
                    $("#ot_ln").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.dat_l2 = ""
                }
                if (event.keyCode == 33) {
                    $("#dat_l1").focus()
                }
            }
            else if (event.target.id == "ot_ln") {
                if (event.keyCode == 13) {
                    $("#vs_bol").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.ot_ln = ""
                }
                if (event.keyCode == 33) {
                    $("#dat_l2").focus()
                }
            }
            else if (event.target.id == "vs_bol") {
                if (event.keyCode == 13) {
                    $("#dis_sex_bol").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.vs_bol = ""
                }
                if (event.keyCode == 33) {
                    $("#ot_ln").focus()
                }
            }
            else if (event.target.id == "dis_sex_bol") {
                if (event.keyCode == 46) {
                    app.$data.history.dis_sex_bol = ""
                }
                if (event.keyCode == 33) {
                    $("#vs_bol").focus()
                }
            }
        }

        if (document.getElementById("list-profile-list_inf_patient_p").classList.contains('active')) {
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_patient_p")) {
                next_tab()
            }
            if (event.keyCode == 19) {
                let patient_p = $("#inf_patient_p").find('input[type=text]')
                for (pp of patient_p) {
                    pp.blur()
                }
            }
            if (event.target.id == "fam_p") {
                if (event.keyCode == 13) {
                    $("#im_p").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.fam_p = ""
                }
            }
            else if (event.target.id == "im_p") {
                if (event.keyCode == 13) {
                    $("#ot_p").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.im_p = ""
                }
                if (event.keyCode == 33) {
                    $("#fam_p").focus()
                }
            }
            else if (event.target.id == "ot_p") {
                if (event.keyCode == 13) {
                    $("#sex_bol").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.ot_p = ""
                }
                if (event.keyCode == 33) {
                    $("#im_p").focus()
                }
            }
            else if (event.target.id == "sex_bol") {
                if (event.keyCode == 13) {
                    $("#datr_p").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.sex_bol = ""
                }
                if (event.keyCode == 33) {
                    $("#ot_p").focus()
                }
            }
            else if (event.target.id == "datr_p") {
                if (event.keyCode == 13) {
                    $("#mp_roj").focus()
                    app.$data.history.mp_roj = $("#mp_roj").val()
                    app.$data.history.okatog_p = $("#mp_roj").attr("data-kladr-id")
                    app.$data.history.okatop_p = $("#mp_roj").attr("data-kladr-id")
                }
                if (event.keyCode == 46) {
                    app.$data.history.datr_p = ""
                }
                if (event.keyCode == 33) {
                    $("#sex_bol").focus()
                }

            }
            else if (event.target.id == "mp_roj") {
                if (event.keyCode == 13) {
                    $("#udl_p").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.mp_roj = ""
                    app.$data.history.okatog_p = ""
                    app.$data.history.okatop_p = ""
                }
                if (event.keyCode == 33) {
                    $("#sex_bol").focus()
                }
            }
            else if (event.target.id == "udl_p") {
                if (event.keyCode == 13) {
                    $("#sp_pasp").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.udl_p = ""
                }
                if (event.keyCode == 33) {
                    $("#mp_roj").focus()
                }
            }
            else if (event.target.id == "sp_pasp") {
                if (event.keyCode == 13) {
                    $("#np_pasp").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.sp_pasp = ""
                }
                if (event.keyCode == 33) {
                    $("#udl_p").focus()
                }
            }
            else if (event.target.id == "np_pasp") {
                if (event.keyCode == 13) {
                    $("#skom_p").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.np_pasp = ""
                }
                if (event.keyCode == 33) {
                    $("#sp_pasp").focus()
                }
            }
            else if (event.target.id == "skom_p") {
                if (event.keyCode == 13) {
                    $("#stat_p").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.skom_p = ""
                }
                if (event.keyCode == 33) {
                    $("#np_pasp").focus()
                }
            }
            else if (event.target.id == "stat_p") {
                if (event.keyCode == 13) {
                    $("#s_pol").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.stat_p = ""
                }
                if (event.keyCode == 33) {
                    $("#skom_p").focus()
                }
            }
            else if (event.target.id == "s_pol") {
                if (event.keyCode == 13) {
                    $("#n_pol").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.s_pol = ""
                }
                if (event.keyCode == 33) {
                    $("#stat_p").focus()
                }
            }
            else if (event.target.id == "n_pol") {
                if (event.keyCode == 46) {
                    app.$data.history.n_pol = ""
                }
                if (event.keyCode == 33) {
                    $("#s_pol").focus()
                }
            }
        }

        if (document.getElementById("list-profile-list_inf_adr").classList.contains('active')) {

            if (event.target.id == "c_oksm_in") {
                if (event.keyCode == 13) {
                    $("#m_roj_in").focus()
                    $("#m_roj_in").change(function () {
                        app.$data.history.m_roj = $("#m_roj_in").val()
                        app.$data.history.okatog = $("#m_roj_in").attr("data-kladr-id")
                    })
                }
                if (event.keyCode == 46) {
                    // console.log('123d')
                    app.$data.history.c_oksm_in = ""
                    document.getElementById("c_oksm_in").value = ""
                }
            }
            else if (event.target.id == "m_roj_in") {
                if (event.keyCode == 13) {
                    $("#kv_in").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.m_roj_in = ""
                    document.getElementById("m_roj_in").value = ""
                }
                if (event.keyCode == 33) {
                    $("#c_oksm_in").focus()
                }
            }
            else if (event.target.id == "kv_in") {
                if (event.keyCode == 13) {
                    $("#kp_in").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.kv_in = ""
                    document.getElementById("kv_in").value = ""
                }
                if (event.keyCode == 33) {
                    $("#m_roj_in").focus()
                }
            }
            else if (event.target.id == "kp_in") {
                if (event.keyCode == 13) {
                    $("#stro_in").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.kp_in = ""
                    document.getElementById("kp_in").value = ""
                }
                if (event.keyCode == 33) {
                    $("#kv_in").focus()
                }
            }
            else if (event.target.id == "stro_in") {
                if (event.keyCode == 13) {
                    $("#cj_in").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.stro_in = ""
                    document.getElementById("stro_in").value = ""
                }
                if (event.keyCode == 33) {
                    $("#kp_in").focus()
                }
            }
            else if (event.target.id == "cj_in") {
                if (event.keyCode == 13) {
                    $("#rai_in").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.cj_in = ""
                    document.getElementById("cj_in").value = ""
                }
                if (event.keyCode == 33) {
                    $("#stro_in").focus()
                }
            }
            else if (event.target.id == "rai_in") {
                if (event.keyCode == 13) {
                    document.getElementById("list-home-list_inf_pers_info").click()
                    setTimeout(() => {
                        $("#adr_in").focus()
                        $("#adr_in").change(function () {
                            app.$data.history.adr = $("#adr_in").val()
                            app.$data.history.okatop = $("#adr_in").attr("data-kladr-id")
                        })
                    }, 1200)

                }
                if (event.keyCode == 46) {
                    app.$data.history.rai_in = ""
                    document.getElementById("rai_in").value = ""
                }
                if (event.keyCode == 33) {
                    $("#cj_in").focus()
                }
            }
        }

        if (document.getElementById("list-profile-list_inf_onmk").classList.contains('active')) {
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_onmk")) {
                next_tab()
            }
            if (event.keyCode == 19) {
                document.getElementById("list-profile-list_inf_onmk").click()
            }
        }

        if (document.getElementById("list-profile-list_inf_onk").classList.contains('active')) {
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_onk")) {
                next_tab()
            }
            let scrol = document.getElementById("inf_onk_scrol")


            if (event.keyCode == 19) {
                let onk = $("#inf_onk").find('input[type=text]')
                for (o of onk) {
                    o.blur()
                }
            }

            if (event.target.id == "ds1_t") {
                if (event.keyCode == 13) {
                    $("#stad").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.ds1_t = ""
                }
            }
            else if (event.target.id == "stad") {
                if (event.keyCode == 13) {
                    $("#onk_t").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.stad = ""
                }
                if (event.keyCode == 33) {
                    $("#ds1_t").focus()
                }
            }
            else if (event.target.id == "onk_t") {
                if (event.keyCode == 13) {
                    $("#onk_n").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.onk_t = ""
                }
                if (event.keyCode == 33) {
                    $("#stad").focus()
                }
            }
            else if (event.target.id == "onk_n") {
                if (event.keyCode == 13) {
                    $("#onk_m").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.onk_n = ""
                }
                if (event.keyCode == 33) {
                    $("#onk_t").focus()
                }
            }
            else if (event.target.id == "onk_m") {
                if (event.keyCode == 13) {
                    $("#mtstz").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.onk_m = ""
                }
                if (event.keyCode == 33) {
                    $("#onk_n").focus()
                }
            }
            else if (event.target.id == "mtstz") {
                if (event.keyCode == 13) {
                    $("#c_zab").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.mtstz = ""
                }
                if (event.keyCode == 33) {
                    $("#onk_m").focus()
                }
            }
            else if (event.target.id == "c_zab") {
                if (event.keyCode == 13) {
                    $("#diag_date").focus()
                    setTimeout(() => {
                        scrol.scrollTop = 150
                    }, 20)
                }
                if (event.keyCode == 46) {
                    app.$data.history.c_zab = ""
                }
                if (event.keyCode == 33) {
                    $("#mtstz").focus()
                }
            }
            else if (event.target.id == "diag_date") {
                if (event.keyCode == 13) {
                    $("#diag_tip").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.diag_date = ""
                }
                if (event.keyCode == 33) {
                    $("#c_zab").focus()
                }
            }
            else if (event.target.id == "diag_tip") {
                if (event.keyCode == 13) {
                    $("#diag_code").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.diag_tip = ""
                }
                if (event.keyCode == 33) {
                    $("#diag_date").focus()
                }
            }
            else if (event.target.id == "diag_code") {
                if (event.keyCode == 13) {
                    $("#diag_rslt").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.diag_code = ""
                }
                if (event.keyCode == 33) {
                    $("#diag_tip").focus()
                }
            }
            else if (event.target.id == "diag_rslt") {
                if (event.keyCode == 13) {
                    $("#rec_rslt").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.diag_rslt = ""
                }
                if (event.keyCode == 33) {
                    $("#diag_code").focus()
                }
            }
            else if (event.target.id == "rec_rslt") {
                if (event.keyCode == 13) {
                    $("#dt_cons").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.rec_rslt = ""
                }
                if (event.keyCode == 33) {
                    $("#diag_rslt").focus()
                }
            }
            else if (event.target.id == "dt_cons") {
                if (event.keyCode == 13) {
                    $("#pr_cons").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.dt_cons = ""
                }
                if (event.keyCode == 33) {
                    $("#rec_rslt").focus()
                }
            }
            else if (event.target.id == "pr_cons") {
                if (event.keyCode == 13) {
                    $("#usl_tip").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.pr_cons = ""
                }
                if (event.keyCode == 33) {
                    $("#dt_cons").focus()
                }
            }
            else if (event.target.id == "usl_tip") {
                if (event.keyCode == 13) {
                    $("#hir_tip").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.usl_tip = ""
                }
                if (event.keyCode == 33) {
                    $("#pr_cons").focus()
                }
            }
            else if (event.target.id == "hir_tip") {
                if (event.keyCode == 13) {
                    $("#d_prot").focus()
                    setTimeout(() => {
                        scrol.scrollTop = 1050
                    }, 20)
                }
                if (event.keyCode == 46) {
                    app.$data.history.hir_tip = ""
                }
                if (event.keyCode == 33) {
                    $("#usl_tip").focus()
                }
            }
            else if (event.target.id == "d_prot") {
                if (event.keyCode == 13) {
                    $("#prot").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.d_prot = ""
                }
                if (event.keyCode == 33) {
                    $("#hir_tip").focus()
                }
            }
            else if (event.target.id == "prot") {
                if (event.keyCode == 13) {
                    $("#naprdate").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.prot = ""
                }
                if (event.keyCode == 33) {
                    $("#d_prot").focus()
                }
            }
            else if (event.target.id == "naprdate") {
                if (event.keyCode == 13) {
                    $("#napr_v").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.naprdate = ""
                }
                if (event.keyCode == 33) {
                    $("#prot").focus()
                }
            }
            else if (event.target.id == "napr_v") {
                if (event.keyCode == 13) {
                    $("#napr_mo").focus()
                }

                if (event.keyCode == 46) {
                    app.$data.history.napr_v = ""
                }
                if (event.keyCode == 33) {
                    $("#naprdate").focus()
                }
            }
            else if (event.target.id == "napr_mo") {
                if (event.keyCode == 13) {
                    $("#napr_issl").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.napr_mo = ""
                }
                if (event.keyCode == 33) {
                    $("#napr_v").focus()
                }
            }
            else if (event.target.id == "napr_issl") {
                if (event.keyCode == 13) {
                    $("#napr_usl").focus()
                }
                if (event.keyCode == 46) {
                    app.$data.history.napr_issl = ""
                }
                if (event.keyCode == 33) {
                    $("#napr_mo").focus()
                }
            }
            else if (event.target.id == "napr_usl") {
                if (event.keyCode == 13) {
                    app.next_tabs()
                }
                if (event.keyCode == 46) {
                    app.$data.history.napr_usl = ""
                }
                if (event.keyCode == 33) {
                    $("#napr_issl").focus()
                }
            }
        }

        if (document.getElementById("list-profile-list_inf_mo").classList.contains('active')) {
            if ((event.target.id == "staticBackdrop") || (event.target.id == "list-profile-list_inf_mo")) {
                next_tab()
            }
            if (event.keyCode == 19) {
                let mo = $("#inf_mo").find('input[type=text]')
                for (m of mo) {
                    m.blur()
                }
            }
            if (event.keyCode == 46) {
                app.$data.history.pmg = ""
            }
        }


    })
}



function mask() {
    // let input_datp = document.getElementById("datp")
    // input_datp.setAttribute("maxlength", 10)
    // input_datp.addEventListener("input", function () {
    //     var n = input_datp.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_datp.value = n.join('')
    // })

    // let input_tm_otd = document.getElementById("tm_otd")
    // input_tm_otd.setAttribute("maxlength", 5)
    // input_tm_otd.addEventListener("input", function () {
    //     var n = input_tm_otd.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, ':')
    //     input_tm_otd.value = n.join('')
    // })

    // let input_datv = document.getElementById("datv")
    // input_datv.setAttribute("maxlength", 10)
    // input_datv.addEventListener("input", function () {
    //     var n = input_datv.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_datv.value = n.join('')
    // })

    // let input_datr = document.getElementById("datr")
    // input_datr.setAttribute("maxlength", 10)
    // input_datr.addEventListener("input", function () {
    //     var n = input_datr.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_datr.value = n.join('')
    // })

    // let input_npr_date = document.getElementById("npr_date")
    // input_npr_date.setAttribute("maxlength", 10)
    // input_npr_date.addEventListener("input", function () {
    //     var n = input_npr_date.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_npr_date.value = n.join('')
    // })

    // let input_dat_otd = document.getElementById("dat_otd")
    // input_dat_otd.setAttribute("maxlength", 10)
    // input_dat_otd.addEventListener("input", function () {
    //     var n = input_dat_otd.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_dat_otd.value = n.join('')
    // })

    // let input_tm_otd_d = document.getElementById("tm_otd_d")
    // input_tm_otd_d.setAttribute("maxlength", 5)
    // input_tm_otd_d.addEventListener("input", function () {
    //     var n = input_tm_otd_d.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, ':')
    //     input_tm_otd_d.value = n.join('')
    // })

    // let input_dat_pe = document.getElementById("dat_pe")
    // input_dat_pe.setAttribute("maxlength", 10)
    // input_dat_pe.addEventListener("input", function () {
    //     var n = input_dat_pe.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_dat_pe.value = n.join('')
    // })

    // let input_wskr_date = document.getElementById("wskr_date")
    // input_wskr_date.setAttribute("maxlength", 10)
    // input_wskr_date.addEventListener("input", function () {
    //     var n = input_wskr_date.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_wskr_date.value = n.join('')
    // })


    // let input_tm_let = document.getElementById("tm_let")
    // input_tm_let.setAttribute("maxlength", 5)
    // input_tm_let.addEventListener("input", function () {
    //     var n = input_tm_let.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, ':')
    //     input_tm_let.value = n.join('')
    // })

    // let input_docdate = document.getElementById("docdate")
    // input_docdate.setAttribute("maxlength", 10)
    // input_docdate.addEventListener("input", function () {
    //     var n = input_docdate.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_docdate.value = n.join('')
    // })

    // let input_ss = document.getElementById("ss")
    // input_ss.setAttribute("maxlength", 14)
    // input_ss.addEventListener("input", function () {
    //     var n = input_ss.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 3) n.splice(3, 0, '-')
    //     if (n.length > 7) n.splice(7, 0, '-')
    //     if (n.length > 11) n.splice(11, 0, ' ')
    //     input_ss.value = n.join('')
    // })


    // let input_vb_a_datv = document.getElementById("vb_a_datv")
    // input_vb_a_datv.setAttribute("maxlength", 10)
    // input_vb_a_datv.addEventListener("input", function () {
    //     var n = input_vb_a_datv.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_vb_a_datv.value = n.join('')
    // })

    // let input_dat_l1 = document.getElementById("dat_l1")
    // input_dat_l1.setAttribute("maxlength", 10)
    // input_dat_l1.addEventListener("input", function () {
    //     var n = input_dat_l1.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_dat_l1.value = n.join('')
    // })

    // let input_dat_l2 = document.getElementById("dat_l2")
    // input_dat_l2.setAttribute("maxlength", 10)
    // input_dat_l2.addEventListener("input", function () {
    //     var n = input_dat_l2.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_dat_l2.value = n.join('')
    // })

    // let input_diag_date = document.getElementById("diag_date")
    // input_diag_date.setAttribute("maxlength", 10)
    // input_diag_date.addEventListener("input", function () {
    //     var n = input_diag_date.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_diag_date.value = n.join('')
    // })

    // let input_dt_cons = document.getElementById("dt_cons")
    // input_dt_cons.setAttribute("maxlength", 10)
    // input_dt_cons.addEventListener("input", function () {
    //     var n = input_dt_cons.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_dt_cons.value = n.join('')
    // })

    // let input_d_prot = document.getElementById("d_prot")
    // input_d_prot.setAttribute("maxlength", 10)
    // input_d_prot.addEventListener("input", function () {
    //     var n = input_d_prot.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_d_prot.value = n.join('')
    // })

    // let input_naprdate = document.getElementById("naprdate")
    // input_naprdate.setAttribute("maxlength", 10)
    // input_naprdate.addEventListener("input", function () {
    //     var n = input_naprdate.value.replace(/[^0-9]/g, '').split('')
    //     if (n.length > 2) n.splice(2, 0, '-')
    //     if (n.length > 4) n.splice(5, 0, '-')
    //     input_naprdate.value = n.join('')
    // })
}
function next_tab() {
    if (stop_tab() && (event.target.type != "text")) {
        if (event.keyCode === 49 || event.keyCode === 97) {
            document.getElementById("list-home-list_inf_pers_info").click()
        }
        else if (event.keyCode === 50 || event.keyCode === 98) {
            document.getElementById("list-profile-list_inf_diagnoses").click()
        }
        else if (event.keyCode === 51 || event.keyCode === 99) {
            document.getElementById("list-profile-list_inf_koyko").click()
        }
        else if (event.keyCode === 52 || event.keyCode === 100) {
            document.getElementById("list-profile-list_inf_operation").click()
            document.getElementById("list-profile-list_inf_operation").click()
        }
        else if (event.keyCode === 73) {
            document.getElementById("list-profile-list_inf_med_dev").click()
            document.getElementById("list-profile-list_inf_med_dev").click()
        }
        else if (event.keyCode === 53 || event.keyCode === 101) {
            document.getElementById("list-profile-list_inf_ks_zabolev").click()
        }
        else if (event.keyCode === 54 || event.keyCode === 102) {
            document.getElementById("list-profile-list_inf_complication").click()
            document.getElementById("list-profile-list_inf_complication").click()
        }
        else if (event.keyCode === 55 || event.keyCode === 103) {
            document.getElementById("list-profile-list_inf_work_capacity").click()
        }
        else if (event.keyCode === 56 || event.keyCode === 104) {
            document.getElementById("list-profile-list_inf_manipulation").click()
            document.getElementById("list-profile-list_inf_manipulation").click()
        }
        else if (event.keyCode === 57 || event.keyCode === 105) {
            document.getElementById("list-profile-list_inf_translations").click()
        }
        else if (event.keyCode === 65) {
            document.getElementById("list-profile-list_inf_post_mortem").click()
        }
        else if (event.keyCode === 66) {
            document.getElementById("list-profile-list_inf_injury").click()
        }
        else if (event.keyCode === 67) {
            document.getElementById("list-profile-list_inf_policy_passport_snills").click()
        }
        else if (event.keyCode === 68) {
            document.getElementById("list-profile-list_inf_pregnancy").click()
        }
        else if (event.keyCode === 69) {
            document.getElementById("list-profile-list_inf_disability").click()
        }
        else if (event.keyCode === 70) {
            document.getElementById("list-profile-list_inf_patient_p").click()
        }
        else if (event.keyCode === 73) {
            document.getElementById("list-profile-list_inf_onmk").click()
        }
        else if (event.keyCode === 74) {
            document.getElementById("list-profile-list_inf_onk").click()
        }
        else if (event.keyCode === 75) {
            document.getElementById("list-profile-list_inf_mo").click()
        }
    }

}

function stop_tab() {
    if (event.target.id != "aro_n" && event.target.id != "vb_a_datv" && event.target.id != "srber"
        && event.target.id != "n_ber" && event.target.id != "pria" && event.target.id != "m_prer"
        && event.target.id != "vs_bol" && event.target.id != "napr_usl" && event.target.name != "py"
        && event.target.name != "goc" && event.target.name != "pop" && event.target.name != "inf_oper"
        && event.target.name != "xosl" && event.target.name != "posl" && event.target.name != "aosl"
        && event.target.name != "pl") {
        return true
    }
}