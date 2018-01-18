function tableData(data) {
    result = [];
    for (item in data) {
        ritem = [];
        ritem.push(data[item]._id, data[item].name, data[item].price, data[item].quantity);
        result.push(ritem);
    }
    return result;
}

djb2Code = function (str) {
    var hash = 5381;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) + hash) + char;
        /* hash * 33 + c */
    }
    return hash;
};

function calcId(column) {
    return Math.abs(djb2Code(column) % 999);
}

function addRow(columnNames, table) {
    tr = document.createElement('tr');
    for (let column in columnNames) {
        td = document.createElement('td');
        if (column == 0 && columnNames[column] != 'Id') {
            td.setAttribute('id', columnNames[column]);
            let hashCode = calcId(columnNames[column]);
            td.appendChild(document.createTextNode(hashCode));
        }
        else {
            td.appendChild(document.createTextNode(columnNames[column]));
        }
        tr.appendChild(td)
    }
    table.appendChild(tr)
}

function createTable(data) {
    var table = document.getElementById("prices");
    let body = table.createTBody();
    let tdata = tableData(data);
    for (rowid in tdata) {
        addRow(tdata[rowid], body);
    }
}

function buyPhone(cellId, quantity) {
    $.ajax({
        crossDomain: true,
        url: "http://127.0.0.1:3000/item/" + cellId,
        type: 'PUT',
        data: {_id: cellId, quantity: quantity}
    }).then(function (data) {
        let number = data['quantity'];
        $('#prices').find('tbody tr.selected td:last').text(number)
    });
}

function deletePhone(cellId) {
    $.ajax({
        crossDomain: true,
        url: "http://127.0.0.1:3000/item/" + cellId,
        type: 'DELETE',
    }).then(function (data) {

        // let currentRow = $('#prices').find('tbody tr.selected');
        document.table.row('.selected').remove().draw();
    });
}

let buttons = $('#buttons');
buttons.find('#buy').on('click', function (e) {
    $('#buy_order').toggleClass('hidden');
});

function validations(to_buy) {
    if ("" == $('#buy_order').find('#email').val()) {
        alert('Заполните. пожалуйста, ваш email');
        return false;
    }
    if ("" == to_buy) {
        alert('Заполните. пожалуйста, количество товара');
        return false
    }
    return true;
}

$('#buy_order').find('#buy_submit').on('click', function (e) {
    let to_buy = $('#buy_order').find('#buy_quantity').val();
    if (!validations(to_buy)) {
        return;
    }
    let table = $('#prices');
    let cellId = table.find("tbody tr.selected td:first").attr('id');
    let quantity = table.find("tbody tr.selected td:last").text();
    if (quantity - to_buy > 0) {
        buyPhone(cellId, quantity - to_buy);
    }
    else if (quantity - to_buy < 0) {
        alert('Столько товара нет на складе');
    }
    else {
        deletePhone(cellId)
    }
});

buttons.find('#add').on('click', function (e) {
    $('#new_item').toggleClass('hidden');
});

$('#new_item').find('#submit').on('click', function (e) {
    let new_item = $('#new_item');
    let name = new_item.find('#name').val()
    let price = new_item.find('#price').val()
    let quantity = new_item.find('#quantity').val()
    $.ajax({
        crossDomain: true,
        url: "http://127.0.0.1:3000/item",
        type: 'POST',
        data: {name: name, price: price, quantity: quantity}
    }).then(function (data) {
        let ritem = [];
        ritem.push(calcId(data._id), data.name, data.price, data.quantity);
        let added_row = document.table.row.add(ritem);
        added_row.draw();
        let selector = $(added_row.node());
        selector.find('td:first').attr('id', data._id);
        select_row(selector);
    });
    new_item.addClass('hidden');
});

$(document).ready(function () {
    $.ajax({
        crossDomain: true,
        url: "http://127.0.0.1:3000/item"
    }).then(function (data) {
        createTable(data);
        make_richtable();
    });
});

function select_row(selector) {
    document.table.$('tr.selected').removeClass('selected');
    $(selector).addClass('selected');
}

function make_richtable() {
    let table = $('#prices');
    document.table = table.DataTable();
    table.find("tbody tr").click(function () {
        select_row(this);
    });
}