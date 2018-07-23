var app = angular.module('myApp');
var apiBaseURL = "http://localhost:3000/api/";

app.controller('PatientController', [
    '$scope', '$http','patient','update', 'close',
    function ($scope, $http, patient, update, close) {

        $scope.update = update

        $scope.patientForm = {
            $class: "nz.ac.auckland.Patient",
            id: "string",
            birthDate: "string",
            deathDate: "string",
            ird: "string",
            drivers: "string",
            passport: "string",
            prefix: "string",
            first: "string",
            last: "string",
            suffic: "string",
            maiden: "string",
            marital: "string",
            race: "string",
            ethinicity: "string",
            gender: "string",
            birthplace: "string",
            address: "string",
            records: "[]",
            iv: ".",
            salt: ".",
            PkeyPpass: ".",
            PkeyHPpass: "."
        }
        
        if (patient != null) {
            for (var key in patient) {
                if ($scope.patientForm.hasOwnProperty(key)) {
                    $scope.patientForm[key] = patient[key]
                }

            }
        }

        $scope.updatePatient = function () {
            var endpoint = apiBaseURL + "Patient/" + $scope.patientForm.id 
            $scope.endpoint = endpoint
            patientForm = Object.assign({}, $scope.patientForm)
            delete patientForm.id
            encryptForm(patientForm)
            $http({
                method: 'PUT',
                url: endpoint,
                data: angular.toJson(patientForm),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(_success, _error)
        }


        $scope.submitPatient = function () {
            var endpoint = apiBaseURL + "Patient"
            $scope.endpoint = endpoint
            patientForm = Object.assign({}, $scope.patientForm)
            encryptForm(patientForm)
            $http({
                method: 'POST',
                url: endpoint,
                data: angular.toJson(patientForm),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(_success, _error)
        }

        function encryptForm(form) {
            var keys = Object.keys(form)
    
            keys.forEach(function (key) {
                if (!(key == "$class" || key == "id" || key == "salt" || key == "iv" || key == "PkeyPpass" || key == "PkeyHPpass")) {
                    var encryptedData = symEncrypt(form[key])
                    encryptedData = JSON.parse(encryptedData)
                    form[key] = encryptedData.ct
                }
    
            })
            console.log(form)
        }

        //  This close function doesn't need to use jQuery or bootstrap, because
        //  the button has the 'data-dismiss' attribute.
        $scope.close = function () {
            close({}, 500); // close, but give 500ms for bootstrap to animate
        };


        /**
         * Show response message in a pop-up dialog box
         *
         * @param response
         * @private
         */
        function _success(response) {
            $scope.viewData(response.data);
            alert("Operation successful")
        }

        /**
         * Show error message in a pop-up dialog box
         *
         * @param response
         * @private
         */
        function _error(response) {
            $scope.viewData(response.data)
            alert("Error")
        }

        $scope.viewData = function (data) {

            $('#json-renderer').jsonViewer(data, { collapsed: true });
    
        }
    }]);