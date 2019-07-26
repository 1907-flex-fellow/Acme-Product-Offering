const productsUrl = 'https://acme-users-api-rev.herokuapp.com/api/products';
const companyUrl = 'https://acme-users-api-rev.herokuapp.com/api/companies';
const offeringUrl = 'https://acme-users-api-rev.herokuapp.com/api/offerings';

let viewProducts;
let idToCheck;

const fetchData = (url) => {
    return fetch(url)
    .then(res => res.json())
}

const companyToFind = (companies, id, price) => {
    const company = companies.find(company => company.id === id);
    if(company){
        company.price = price;
    }
    return company;
}

const findCompanyForProduct = (product, companies, offerings) => {
    return offerings.reduce( (acc, offer) => {
        if(product.id === offer.productId){
            acc.push(companyToFind(companies, offer.companyId, offer.price))
        }
        return acc;
    }, [])
}

const organizeData = (products, companies, offerings) => {
    products.forEach(product => product.companies = findCompanyForProduct(product, companies, offerings))
    return products;
}

window.addEventListener('hashchange', () => {
    idToCheck = window.location.hash.slice(1)
    console.log('idToCheck: ', idToCheck)
    renderData();
})

idToCheck = window.location.hash.slice(1);

const loadData = () => {
    Promise.all([fetchData(productsUrl),fetchData(companyUrl),fetchData(offeringUrl)])
    .then(([products, companies, offerings]) => {
        const newProducts = organizeData(products, companies, offerings);
        viewProducts = [...newProducts]
        renderData();
    })
}

const renderData = () => {
    const container = document.querySelector('#product-container');
      
    const html = viewProducts.filter(prot => !idToCheck || prot.id === idToCheck).map(product => {
        return (
            `<div id='product-card'>
                <a href='#${idToCheck ? '' : product.id}'>${product.name}</a></br>
                ${product.description}</br>
                $${product.suggestedPrice}</br>
                ${product.companies.map(company => {
                    return (
                        `<li>offered by ${company.name} at price $${company.price}</li>`
                    )
                }).join('')}
            </div>`
        )
    }).join('')
    container.innerHTML = html;
}

loadData();

