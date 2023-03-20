foods_prices=[];

async function Get_foods_prices(){
    const r = await fetch("https://raw.githubusercontent.com/meisei-u/prices-of-foods/main/prices.csv");
    const text = await r.text();

    let A = [];

    let lines = text.split(/\r\n|\n/);

    lines.forEach((e)=>{
        let c = e.split(",");
        if (c.length != 1) {
            A.push(c);
        }
    })

    A.shift();

    return A;
}

async function init_func(){
    foods_prices=await Get_foods_prices();
    console.log(foods_prices);
}

function one_render_elem(x){
    return `
    <div class="uk-card uk-card-default uk-card-body uk-width-1-1">
        <h3 class="uk-card-title">${x[0]}</h3>
        <p>値段:${x[1]}円　${x[2]==1 ? "明星大生限定メニュー":""}</p>
    </div>
    `;
}

function render_elem(x){
    return x.map((e)=>{
        return one_render_elem(e);
    })
    .reduce(function(A, e){
        return A+e+"\n";
    }, "");
}

function select_elem(max_price,Is_gakuwari){
    console.log(foods_prices);
    let A=[];
    while(
        A.map((e)=> parseInt(e[1], 10)).reduce(function(A, e){
            return A+e;
        }, 0)+40<max_price
    ){
        while(
            A.map((e)=> parseInt(e[1], 10)).reduce(function(A, e){
                return A+e;
            }, 0)<max_price
        ){
            let I=Math.floor(Math.random()*foods_prices.length);
            if(!Is_gakuwari){
                if(foods_prices[I][2]=="1")
                    continue;
            }
            A.push(foods_prices[I]);
        }
        A.pop();
    }
    return A;
}

function run_gacha(){
    let max_price=parseInt(document.getElementById("max_price").value,10);
    let render_HTML=document.getElementById("elems");
    let Is_gakuwari=document.getElementById("Is_gakuwari").checked;
    
    let data=select_elem(max_price,Is_gakuwari);
    let A=render_elem(data);
    render_HTML.innerHTML=A;

    document.getElementById("sum_price").innerHTML=`合計金額 : ${
        data.map((e)=> parseInt(e[1], 10)).reduce(function(A, e){
            return A+e;
        }, 0)
    }円`;
}

init_func();

