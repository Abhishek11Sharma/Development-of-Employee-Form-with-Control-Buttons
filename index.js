
        var jpdbaseURL = 'http://api.login2explore.com:5577';
        var jpdbIRL = '/api/irl';
        var jpdbIML = '/api/iml';
        var empDBName = 'EMP-DB';
        var empRelationName = "EmpData";
        var connToken = '90931279|-31949327666501619|90961026';

        $('#empid').focus();

        function saveRecNo2LS(jsonObj) {
            var lvData = JSON.parse(jsonObj.data);
            localStorage.setItem('recno', lvData.rec_no);
        }

        function getEmpIdAsJsonObj() {
            var empid = $('#empid').val();
            var jsonStr = {
                id: empid
            };
            return JSON.stringify(jsonStr);
        }


        function getEmp() {
            var empIdJsonObj = getEmpIdAsJsonObj();
            var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
            jQuery.ajaxSetup({ async: false });
            var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbaseURL, jpdbIRL);
            jQuery.ajaxSetup({ async: true });
            if (resJsonObj.status === 400) {
                $("#save").prop("disabled", false);
                $("#reset").prop("disabled", false);
                $("#empname").focus();
            }
            else if (resJsonObj.status === 200) {
                $("#empid").prop("disabled", true);
                fillData(resJsonObj);

                $("#change").prop("disabled", false);
                $("#reset").prop("disabled", false);
                $("#empname").focus();
            }
        }

        function fillData(jsonObj) {
            saveRecNo2LS(jsonObj);
            var data = JSON.parse(jsonObj.data).record;
            $('#empname').val(data.name);
            $('#empsal').val(data.salary);
            $('#hra').val(data.hra);
            $('#da').val(data.da);
            $('#deduct').val(data.deduction);

        }

        function resetForm() {
            $('#empid').val("")
            $('#empname').val("")
            $('#empsal').val("")
            $('#hra').val("")
            $('#da').val("")
            $('#deduct').val("")
            $('#empId').prop("disabled", false)
            $('#save').prop("disabled", true)
            $('#change').prop("disabled", true)
            $('#reset').prop("disabled", true)
            $('#empid').focus();
        }

        function saveData() {
            var jsonObj = validateData();
            if (jsonObj === '') {
                return "";
            }

            var putRequest = createPUTRequest(connToken, jsonObj, empDBName, empRelationName);
            jQuery.ajaxSetup({ async: false });
            var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbaseURL, jpdbIML);
            jQuery.ajaxSetup({ async: true });
            resetForm();
            $('#empid').focus();
        }

        function changeData() {
            $('#change').prop("disabled", true);
            jsonChg = validateData();
            var updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem("recno"));
            jQuery.ajaxSetup({ async: false });
            var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbaseURL, jpdbIML);
            jQuery.ajaxSetup({ async: true });
            console.log(resJsonObj);
            resetForm();
            $('#empid').focus();
        }

        function validateData() {
            var empid, empname, empsal, hra, da, deduct;
            empid = $("#empid").val();
            empname = $("#empname").val();
            empsal = $("#empsal").val();
            hra = $("#hra").val();
            da = $("#da").val();
            deduct = $("#deduct").val();

            if (empid === '') {
                alert("enter employee id");
                $("#empid").focus();
                return "";
            }
            if (empname === '') {
                alert("enter employee name");
                $("#empname").focus();
                return "";
            }
            if (empsal === '') {
                alert("enter employee salary");
                $("#empsal").focus();
                return "";
            }
            if (hra === '') {
                alert("enter employee hra");
                $("#hra").focus();
                return "";
            }
            if (da === '') {
                alert("enter employee da");
                $("#da").focus();
                return "";
            }
            if (deduct === '') {
                alert("enter employee deduct");
                $("#deduct").focus();
                return "";
            }

            var jsonStrObj = {
                id: empid,
                name: empname,
                salary: empsal,
                hra: hra,
                da: da,
                deduction: deduct
            };
            return JSON.stringify(jsonStrObj);

        }
