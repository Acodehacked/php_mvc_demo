var Table = null;
function MakeTable(){
    if(Table != null){
        Table.destroy();
    }
    Table = $('#DataTables_Table_1').DataTable({
        ajax: {
            url:verseurl,
            type:'post',
            beforeSend: function () {
                $("#DataTables_Table_1").LoadingOverlay("show", {
                    background: "rgba(128,46,46,0.23)",
                    image : '<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"> <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill=\"#000\" d=\"M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z">'+
                        '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/> </path> </svg>'
                });
                i= 1;
            },
            complete: function () {
                $("#DataTables_Table_1").LoadingOverlay("hide");
                $('input[name="subselection"]').on('change',function(){
                    var value = $( 'input[name="subselection"]:checked').val();
                    loadingtrue();
                    $.ajax({
                        url:"/VachanaBokka/Subjects",
                        type:"post",
                        data:{
                            'id': value,
                            'lang':lang,
                            'type':'subjects'
                        },
                        success: function (data){
                            var json = JSON.parse(data);
                            loadingfalse();
                            if(json.status == 'success'){
                                var html = '';
                                verseselected = value;
                                $('#addsubjectbtn').show();
                                for (let i = 0; i < json.data.length; i++) {
                                    var sel = '';
                                    if(json.data[i].selected == true){ sel = 'checked'; }
                                    html+= ' <li value="'+json.data[i].id+'" class="border-top" searchdata="'+json.data[i].value+'">' +
                                        '                            <label class="d-flex" for="checkbox'+json.data[i].id +'">' +
                                        '                            <input class="form-check-input subjectslection" '+sel+' name="selectsubjects" id="'+json.data[i].id+'" value="'+json.data[i].id+'" type="checkbox"/>' +
                                        '                               &nbsp;&nbsp;'+ json.data[i].value +
                                        '                            </label>' +
                                        '                        </li>';
                                }
                                $('#subjectlist').html(html)
                            }else{
                                toast('bg-danger',"Subjects not found");
                            }
                        },
                        error: function (){
                            loadingfalse();
                        }
                    })
                });
            },
        },
        serverSide: true,
        fixedHeader: true,
        processing: true,
        columns: [
            {data:'id'},
            {data:'verse_no'},
            {data:'word'},
        ],
        columnDefs: [
            {
                targets: 0,
                searchable: !1,
                orderable: !1,
                render: function(e,t,a,s) {
                    if ( t === 'display' ) {
                        return '<input type="radio" name="subselection" value="'+a['id']+'" class="form-check-input subselection">';
                    }
                    return a['id']
                }
            },
            {
                targets: 2,
                searchable: !0,
                orderable: !0,
                render: function (e,t,a,s){
                    var string = a['word'];
                    return string
                }
            },
            {
                targets: 1,
                searchable: !0,
                type: 'anti-the' ,
                orderable: !0,
                render: function (e,t,a,s){
                        return a['chapter_no']+'-'+a['verse_no']
                }
            },
            {
                targets: 3,
                searchable: !1,
                className :'control',
                orderable: !1,
                title: "Actions",
                render: function (e, t, a, s) {
                        return '<div class="d-inline-block"><a href="javascript:;" class="btn btn-sm btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></a><ul class="dropdown-menu dropdown-menu-end m-0"><li><a href="javascript:;" class="dropdown-item">Mark For Error</a></li><div class="dropdown-divider"></div><li><a href="/VachanaBokka/Verse/Delete?id='+a['id']+'" class="dropdown-item text-danger delete-record">Delete Verse</a></li></ul></div><a href="/VachanaBokka/Verse/Edit?id='+a['id']+'" class="btn btn-sm btn-icon item-edit"><i class="bx bxs-edit"></i></a><a href="/VachanaBokka/Verse/MakePoster?id='+a['id']+'" class="btn btn-sm btn-icon item-edit"><i class="bx bxs-paint"></i></a>'
                }
            }
        ],
        order: [],
        // dom: '<"card-header flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-3 pt-md-0"B>><"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>><"table-responsive"t><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        displayLength: 50,
        lengthMenu: [25, 50, 75, 100,500],
        buttons: []
    });

}
