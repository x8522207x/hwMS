(() => {
  angular.module('firstModule', []).controller('FirstController', ['$scope', ($scope) => {
    $scope.addData = () => {
      if (valid($scope.date, $scope.height, $scope.weight)) {
        let data = {
          date: $scope.date,
          height: $scope.height,
          weight: $scope.weight,
          diff: null,
          style: "",
          mili: ""
        };

        $scope.storeData(data, $scope.loadData);
      }
    };

    $scope.storeData = (data, callback) => {
      $scope.names.push(data);
      localStorage.setItem('data', JSON.stringify($scope.names));
      callback();
    }

    $scope.loadData = () => {
      if (localStorage.getItem('data') !== null) {
        $scope.names = JSON.parse(localStorage.getItem('data'));
      } else {
        $scope.names = [];
      }
      $scope.compareWeight();
      $scope.compareMS();
    }

    $scope.compareWeight = () => {
      for (let i = 1; i < $scope.names.length; i++) {
        $scope.names[i].diff = Number(Number($scope.names[i].weight) - Number($scope.names[i - 1].weight)).toFixed(1);
        if ($scope.names[i].diff > 0) {
          $scope.names[i].style = `red`;
        } else if ($scope.names[i].diff < 0) {
          $scope.names[i].style = `yellow`;
        }
      }
    }

    $scope.compareMS = () => {
      if ($scope.names[0] !== undefined) {
        angular.forEach($scope.names, (name, i) => {
          let result;
          let height = $scope.names[i].height / 100 * $scope.names[i].height / 100;
          result = Number(name.weight / height).toFixed(1);
          if (result < 16.5 || result > 31.5) {
            $scope.names[i].mili = '免役';
          } else if ((16.5 <= result && result < 17) || (31 < result && result <= 31.5)) {
            $scope.names[i].mili = '替代役';
          } else {
            $scope.names[i].mili = '常備役';
          }
        })
      }
    }
  }]);
})();

function valid(date, height, weight, e) {
  if (date === "" || height === "" || weight === "") {
    const table = document.querySelector('table');
    message(`有資料沒輸入`, 'error');
    return false;
  } else {
    message(`成功輸入資料`, 'success');
    return true;
  }
}

function message(message, state) {
  const div = document.createElement('div');
  [div.textContent, div.className] = [message, state];
  document.querySelector('.container').insertBefore(div, document.querySelector('table'));
  setTimeout(() => document.querySelector(`.${state}`).remove(), 3000);
}