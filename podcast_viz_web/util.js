var daysBetween = function (moment1, moment2) {
    return moment2.diff(moment1, "days");
};

var sortObjArray = function (objs) {
    objs.sort(function (a, b) { return a.compareTo(b); });
};

var loadJSONObject = function (fileName) {
    return dataSources[fileName];
};

var str = function (target) {
    return String(target);
}
