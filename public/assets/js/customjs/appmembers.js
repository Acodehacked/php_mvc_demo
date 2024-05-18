document.addEventListener("DOMContentLoaded", function (e) {
    var Table = $('#DataTables_Table_1').DataTable({
        ajax: {
            url:"/AppMembers?diocese="+diocese+"&parish="+parish,
            type:'post',
            beforeSend: function () {
                $("#DataTables_Table_1").LoadingOverlay("show", {
                    background: "rgba(128,46,46,0.23)",
                    image : '<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"> <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"><path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z">'+
                        '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" /> </path> </svg>'
                });
            },
            complete: function () {
                $("#DataTables_Table_1").LoadingOverlay("hide");
            },
        },
        serverSide: true,
        fixedHeader: true,
        processing: true,
        columns: [
            {data:'id'},
            {data:'user_name'},
            {data:'book_id'},
            {data:'user_house_name'},
            {data:'user_cc'},
            {data:'user_phone_number'},
            {data:'user_diocese_id'},
            {data:'user_parish_id'},
            {data:'user_mail'},
            {data:'user_password'},
            {data:'user_dateofbirth'},
            {data:'user_gender'},
            {data:'user_login'},
            {data:'user_residential_status'},
            {data:'user_device'},
            {data:'premium_membership'}
        ],
        columnDefs: [
            {
                targets: 0,
                searchable: !1,
                responsivePriority: 0,
                orderable: !1,
                render: function (){
                    return '<i class="bx bxs-plus-circle text-primary"></i>'
                }
            },
            {
                targets: 1,
                searchable: !0,
                orderable: !0,
                responsivePriority: 0,
                render: function(e,t,a,s) {
                    return '<input type="checkbox" value="'+a['id']+'" class="dt-checkboxes form-check-input">'
                },
                checkboxes : !0,
                checkboxes: {
                    selectRow: !0,
                    selectAllRender: '<input type="checkbox" class="form-check-input">'
                }
            },
            {
                targets: 2,
                searchable: !0,
                responsivePriority: 0,
                orderable: !0,
                render: function (e,t,a,s){
                    return a['user_name']+' '+a['user_house_name']
                }
            },
            {
                targets: 3,
                searchable: !0,
                responsivePriority: 0,
                orderable: !0,
                render: function (e,t,a,s){
                    return a['user_parish_id']
                }
            },
            {
                targets: 4,
                searchable: !0,
                responsivePriority: 0,
                orderable: !0,
                render: function (e,t,a,s){
                    return a['user_cc']+a['user_phone_number']
                }
            },
            {
                targets: 5,
                searchable: !0,
                responsivePriority: 0,
                orderable: !0,
                render: function (e,t,a,s){
                    return a['user_mail']
                }
            },
            {
                targets: 6,
                searchable: !1,
                title : "Password",
                responsivePriority: 0,
                orderable: !0,
                render: function (e,t,a,s){
                    return a['user_password']
                }
            },
            {
                targets: 7,
                searchable: !1,
                title : "Residential Status",
                responsivePriority: 0,
                orderable: !0,
                render: function (e,t,a,s){
                    return a['user_residential_status'] === 1 || a['user_residential_status'] === 'true'  ? 'Indian' : 'Non-Indian'
                }
            },
            {
                targets: 8,
                searchable: !1,
                title : "Gender",
                responsivePriority: 0,
                orderable: !0,
                render: function (e,t,a,s){
                    return a['user_gender']
                }
            },
            {
                targets: 9,
                searchable: !1,
                title : "DOB",
                responsivePriority: 0,
                orderable: !0,
                render: function (e,t,a,s){
                    return a['user_dateofbirth']
                }
            },
            {
                targets: 10,
                searchable: !1,
                title : "Device",
                responsivePriority: 0,
                orderable: !0,
                render: function (e,t,a,s){
                    return a['user_device']
                }
            },
            {
                targets: 11,
                searchable: !1,
                title : "Last Login",
                responsivePriority: 0,
                orderable: !0,
                render: function (e,t,a,s){
                    return a['user_login']
                }
            },
            {
                targets: 12,
                searchable: !1,
                title : "Premium Membership",
                responsivePriority: 0,
                orderable: !0,
                render: function (e,t,a,s){
                    return a['premium_membership']
                }
            },
            {
                targets: 13,
                searchable: !1,
                title : "Action",
                responsivePriority: 0,
                orderable: !1,
                responsivePriority: 1, title: "Actions", orderable: !1, searchable: !1, render: function (e, t, a, s) {
                    return '<div class="d-inline-block"><a href="javascript:;" class="btn btn-sm btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></a><ul class="dropdown-menu dropdown-menu-end m-0"><li><a href="javascript:;" class="dropdown-item">Mark For Error</a></li><div class="dropdown-divider"></div><li><a href="javascript:;" class="dropdown-item text-danger delete-record">Delete Question</a></li></ul></div><a href="/QuestionBank/Edit?id='+a['id']+'" class="btn btn-sm btn-icon item-edit"><i class="bx bxs-edit"></i></a>'
                }
            },
        ],
        order: [[3,"asc"]],
        // dom: '<"card-header flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-3 pt-md-0"B>><"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>><"table-responsive"t><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        displayLength: 7,
        lengthMenu: [7, 10, 25, 50, 75, 100,500],
        buttons: [],
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal({
                    header: function (e) {
                        return "Details of ";
                    }
                }), type: "column", renderer: function (e, t, a) {
                    a = $.map(a, function (e, t) {
                        return "" !== e && e.data !== null  && e.title !== '' ? '<tr data-dt-row="' + e.data + '" data-dt-column="' + e.title + '"><th>' + e.title + ":</th> <td><b>" + e.data + "</b></td></tr>" : ""
                    }).join("");
                    return !!a && $('<table class="table"/><tbody />').append(a)
                }
            }
        },select: {
            style: 'multi',
            selector: 'td:nth-child(2)'
        },
    });
});
