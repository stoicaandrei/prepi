$(document).ready(function () {
    const options = {
        separator: '.',
    };
    const statIdentifiers = ['#pupils', '#exercices', '#hours', '#highschools'];
    for (let stat of statIdentifiers) {
        let number = $(stat).text().replaceAll('.', '');
        let q = new CountUp(stat, number, options);
    }

});