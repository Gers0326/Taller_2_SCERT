App = {
    contracts: {},
    init: async () => {
        console.log("Vamos con toda!");
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        App.render()
    },
    loadWeb3: async () => {
        if (window.ethereum) {
            App.web3Provider = window.ethereum
            await window.ethereum.request({ method: 'eth_requestAccounts' })
            console.log(
                await window.ethereum.request({ method: 'eth_requestAccounts' }),
            )
        } else if (web3) {
            web3 = new Web3(window.web3.currentProvider)
        } else {
            console.log(
                'No ethereum browser is installed. Try it installing MetaMask ',
            )
        }
    },
    loadAccount: async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts',})
        App.account = accounts[0]
    },
    loadContract: async () => {
        try {
            const res = await fetch('SalesContract.json')
            const salesContractJSON = await res.json()
            console.log(salesContractJSON)
            App.contracts.salesContract = TruffleContract(salesContractJSON)
            App.contracts.salesContract.setProvider(App.web3Provider)
            App.saleContract = await App.contracts.salesContract.deployed()
        } catch (error) {
            console.error(error)
        }
    },
    render: async () => {
        document.getElementById('account').innerText = App.account
    },
    
    renderSales: async () => {
        const SalesCounter = await App.SalesContract.salesCounter()
        const SalesCounterNumber = SalesCounter.toNumber()
    
        let html = ''
    
        for (let i = 1; i <= SalesCounterNumber; i++) {
          const sales = await App.salesContract.sale(i)
          const productName = sales[0].toNumber()
          const description = sales[1]
          const price = sales[2]
          const saleCreatedAt = sales[3]
    
          // Creating a task Card
          let saleElement = `<div class="card bg-dark rounded-0 mb-2">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span>${productName}</span>
              <div class="form-check form-switch">
                <input class="form-check-input" data-id="${price}" type="checkbox" onchange="App.toggleDone(this)" ${
            saleDone === true && 'checked'
          }>
              </div>
            </div>
            <div class="card-body">
              <span>${saledescription}</span>
              <span>${saleDone}</span>
              <p class="text-muted">Task was created ${new Date(
                saleCreatedAt * 1000,
              ).toLocaleString()}</p>
              </label>
            </div>
          </div>`
          html += saleElement
        }
    
        document.querySelector('#tasksList').innerHTML = html
      },
      createSale: async (productName,description,price) => {
        try {
          const result = await App.salesContract.createSale(productName,description,price, {
            from: App.account,
          })
          console.log(result.logs[0].args)
          window.location.reload()
        } catch (error) {
          console.error(error)
        }
      },
      toggleDone: async (element) => {
        const price = element.dataset.id
        await App.salesContract.toggleDone(price, {
          from: App.account,
        })
        window.location.reload()
      },
    
}