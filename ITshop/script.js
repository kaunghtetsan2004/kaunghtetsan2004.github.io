$(document).ready(function () {

    count();
    getData();


    function count() {
        let shopString = localStorage.getItem('shops');
        if (shopString) {
            let shopArray = JSON.parse(shopString);

            if (shopArray != null) {
                $('#count_item').text(shopArray.length);
            }
        }
    }

    function getData() {
        let shopString = localStorage.getItem('shops');
        if (shopString) {
            let shopArray = JSON.parse(shopString);
            let data = '';
            let j = 1;
            let total = 0;

            $.each(shopArray, function (i, v) {

                let subtotal = v.price * v.qty;
                total += subtotal;

                data += `<tr>
                <td>${j++}</td>
                <td>${v.name}</td>
                <td>${v.price}</td>
                <td>
                <button class="minus" data-id="${i}">-</button>
                 ${v.qty}
                <button class="plus" data-id="${v.id}">+</button>
                </td>
                <td>${v.price * v.qty}</td>

                </tr>`
            })

            $('#shopTbody').html(data);

            $('#total').text(total + 'MMK');
        }
    }

    $(document).on('click', '.plus', function(){
    let id = $(this).data('id');
    let shopArray = JSON.parse(localStorage.getItem('shops'));

    $.each(shopArray, function(i,v){
        if(v.id == id){
            v.qty++;
        }
    });

    localStorage.setItem('shops', JSON.stringify(shopArray));
    getData();
});

$('#shopTbody').on('click', '.minus', function(){
    let key = $(this).data('id');
    let shopArray = JSON.parse(localStorage.getItem('shops'));

    $.each(shopArray, function(i,v){
        if(key == i ){
            v.qty--;
            if(v.qty <= 0){
                shopArray.splice(key,1);
                return false;
            }
        }
    });

    localStorage.setItem('shops', JSON.stringify(shopArray));
    getData();
});

    $('.addToCart').click(function () {


        let id = $(this).data('id');
        let name = $(this).data('name');
        let price = $(this).data('price');


        // console.log(id,name,price);
        let shop_items = {
            id: id,
            name: name,
            price: price,
            qty: 1
        }

        //console.log(shop_items)
        let shopString = localStorage.getItem('shops')
        let shopArray;
        if (shopString == null) {
            shopArray = [];
        } else {
            shopArray = JSON.parse(shopString);
        }

        let status = false;
        $.each(shopArray, function (i, v) {
            if (id == v.id) {
                status = true;
                v.qty++;
            }
        })

        if (status == false) {
            shopArray.push(shop_items);
        }


        let shopData = JSON.stringify(shopArray);
        localStorage.setItem('shops', shopData);
        count();
        getData();
    });

    $('#order_now').click(function(){
        let ans = confirm('Are you sure order?');
        if(ans){
            localStorage.removeItem('shops');
            window.location.href = 'index.html';
        }
    })
});

