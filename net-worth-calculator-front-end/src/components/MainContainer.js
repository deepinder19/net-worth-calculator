import React from 'react'
import InputField from './InputField'
import currencySymbolMap from '../currencySymbolMap'
import { formatToCurrency, formatCurrencyToString } from '../utils'
import { getAccounts, updateAccounts, updateCurrency } from '../api'

const CURRENCIES = ['USD', 'CAD', 'EUR', 'GBP', 'AUD', 'CNY', 'INR', 'JPY', 'THB', 'RUB']

export default class MainContainer extends React.Component {

  state = {
    currency: '',
    currencySymbol: '',
    netWorth: '',
    totalAssets: '',
    totalLiabilities: '',
    oldValue: null,
    error: true,
    loading: false,
    // Assets
    chequing: '',
    savingsForTaxes: '',
    rainyDayFund: '',
    savingsForFun: '',
    savingsForTravel: '',
    savingsPersonalDevelopment: '',
    investment1: '',
    investment2: '',
    investment3: '',
    primaryHome: '',
    secondHome: '',
    otherLongTermAsset: '',
    // Liabilities
    creditCard1: '',
    creditCard2: '',
    mortgage1: '',
    mortgage2: '',
    lineOfCredit: '',
    investmentLoan: ''
  }

  async componentDidMount() {
    try {
      this.setState({
        loading: true,
        error: false
      })
      const res = await getAccounts()
      const parsedRes = this.parseResponse(res)
      this.setState(parsedRes)
    } catch (err) {
      console.error(err)
      this.setState({error: true})
    } finally {
      this.setState({loading: false})
    }
  }

  parseResponse = (res) => {
    res['netWorth'] = (res.totalAssets || 0) - (res.totalLiabilities || 0)
    Object.keys(res).forEach(key => {
      if (key !== 'currency') {
        res[key] = formatToCurrency(res.currency || 'USD', res[key])
      }
    })
    res['currencySymbol'] = currencySymbolMap[res.currency]
    return res
  }

  onFieldFocus = (field, value) => {
    return (_event) => {
      const formatted = formatCurrencyToString(value)
      this.setState({
        [field]: formatted,
        oldValue: formatted
      })
    }
  }

  onFieldBlur = (field, value) => {
    return async (event) => {
      if ( !event.currentTarget.contains( document.activeElement ) ) {
        if (this.state.oldValue === value) {
          this.setState({[field]: formatToCurrency(this.state.currency, value)})
        } else {
          try {
            this.setState({
              loading: true,
              error: false
            })
            const res = await updateAccounts({[field]: parseFloat(value) || 0})
            const parsedRes = this.parseResponse(res)
            this.setState(parsedRes)
          } catch (err) {
            console.error(err)
            this.setState({error: true})
          } finally {
            this.setState({loading: false})
          }
        }
      }
    }
  }
  
  onFieldChange = (field) => {
    return (event) => {
      this.setState({[field]: event.target.value})
    }
  }

  handleCurrencyChange = async (event) => {
    try {
      this.setState({
        loading: true,
        error: false
      })
      const currency = event.target.value
      const res = await updateCurrency({currency})
      const parsedRes = this.parseResponse(res)
      this.setState(parsedRes)
    } catch (err) {
      console.error(err)
      this.setState({error: true})
    } finally {
      this.setState({loading: false})
    }
    this.setState({
      currency: event.target.value,
      currencySymbol: currencySymbolMap[event.target.value]
    })
  }

  resetError = () => {
    this.setState({error: false})
  }

  getFields = () => {
    return {
      cashAndInvestments: [
        {
          name: 'chequing',
          label: 'Chequing',
          value: this.state.chequing
        },
        {
          name: 'savingsForTaxes',
          label: 'Savings for taxes',
          value: this.state.savingsForTaxes
        },
        {
          name: 'rainyDayFund',
          label: 'Rainy day fund',
          value: this.state.rainyDayFund
        },
        {
          name: 'savingsForFun',
          label: 'Savings for fun',
          value: this.state.savingsForFun
        },
        {
          name: 'savingsForTravel',
          label: 'Savings for travel',
          value: this.state.savingsForTravel
        },
        {
          name: 'savingsPersonalDevelopment',
          label: 'Savings for personal development',
          value: this.state.savingsPersonalDevelopment
        },
        {
          name: 'investment1',
          label: 'Investment 1',
          value: this.state.investment1
        },
        {
          name: 'investment2',
          label: 'Investment 2',
          value: this.state.investment2
        },
        {
          name: 'investment3',
          label: 'Investment 3',
          value: this.state.investment3
        }
      ],
      longTermAssets: [
        {
          name: 'primaryHome',
          label: 'Primary home',
          value: this.state.primaryHome
        },
        {
          name: 'secondHome',
          label: 'Second home',
          value: this.state.secondHome
        },
        {
          name: 'otherLongTermAsset',
          label: 'Other',
          value: this.state.otherLongTermAsset
        }
      ],
      shortTermLiabilities: [
        {
          name: 'creditCard1',
          label: 'Credit card 1',
          value: this.state.creditCard1
        },
        {
          name: 'creditCard2',
          label: 'Credit card 2',
          value: this.state.creditCard2
        }
      ],
      longTermDebt: [
        {
          name: 'mortgage1',
          label: 'Mortgage 1',
          value: this.state.mortgage1
        },
        {
          name: 'mortgage2',
          label: 'Mortgage 2',
          value: this.state.mortgage2
        },
        {
          name: 'lineOfCredit',
          label: 'Line of credit',
          value: this.state.lineOfCredit
        },
        {
          name: 'investmentLoan',
          label: 'Investment loan',
          value: this.state.investmentLoan
        }
      ]
    }
  }


  render(){
    return (
      <div className="container py-5">
        {
          this.state.error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              Something went wrong. Please try again!
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={this.resetError}></button>
            </div>
          )
        }
        <h1>Tracking your net worth</h1>
        <div className="d-flex justify-content-end">
          <div className="me-2">Select currency:</div>
          <select onChange={this.handleCurrencyChange} value={this.state.currency} disabled={this.state.loading} >
            {
              CURRENCIES.map(currency => {
                return <option key={currency} value={currency}>{currency}</option>    
              })
            }
          </select>
        </div>
        <div className="row mt-3 py-2 border-top border-bottom">
          <div className="col-9 fw-bold text-success">Net worth</div>
          <div className="col-3 d-flex justify-content-between">
            <div>{this.state.currencySymbol}</div>
            <div>{this.state.netWorth}</div>
          </div>
        </div>
        <div className="row py-2">
          <div className="col fw-bold text-success">Assets</div>
        </div>
        <div className="row border">
          <div className="col">
            {/* Cash and invetsments */}
            <div className="row border-bottom">
              <div className="col fw-bold">Cash and investments</div>
            </div>
            {
              this.getFields().cashAndInvestments.map(field => {
                return <InputField key={field.label} field={field} currencySymbol={this.state.currencySymbol} onFieldChange={this.onFieldChange} onFieldFocus={this.onFieldFocus} onFieldBlur={this.onFieldBlur} disabled={this.state.loading} />
              })
            }
            {/* Long term assets */}
            <div className="row border-top border-bottom">
              <div className="col fw-bold">Long term assets</div>
            </div>
            {
              this.getFields().longTermAssets.map(field => {
                return <InputField key={field.label} field={field} currencySymbol={this.state.currencySymbol} onFieldChange={this.onFieldChange} onFieldFocus={this.onFieldFocus} onFieldBlur={this.onFieldBlur} disabled={this.state.loading} />
              })
            }
            {/* Total Assets */}
            <div className="row border-top">
              <div className="col-9 fw-bold text-success">Total assets</div>
              <div className="col-3 d-flex justify-content-between border-start">
                <div>{this.state.currencySymbol}</div>
                <div>{this.state.totalAssets}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Liabilities */}
        <div className="row mt-3 py-2">
          <div className="col fw-bold text-success">Liabilities</div>
        </div>
        <div className="row border">
          <div className="col">
            {/* Short term liabilities */}
            <div className="row border-bottom">
              <div className="col fw-bold">Short term liabilities</div>
            </div>
            {
              this.getFields().shortTermLiabilities.map(field => {
                return <InputField key={field.label} field={field} currencySymbol={this.state.currencySymbol} onFieldChange={this.onFieldChange} onFieldFocus={this.onFieldFocus} onFieldBlur={this.onFieldBlur} disabled={this.state.loading} />
              })
            }
            {/* Long term debt */}
            <div className="row border-top border-bottom">
              <div className="col fw-bold">Long term debt</div>
            </div>
            {
              this.getFields().longTermDebt.map(field => {
                return <InputField key={field.label} field={field} currencySymbol={this.state.currencySymbol} onFieldChange={this.onFieldChange} onFieldFocus={this.onFieldFocus} onFieldBlur={this.onFieldBlur} disabled={this.state.loading} />
              })
            }
            {/* Total Liabilities */}
            <div className="row border-top">
              <div className="col-9 fw-bold text-success">Total liabilities</div>
              <div className="col-3 d-flex justify-content-between border-start">
                <div>{this.state.currencySymbol}</div>
                <div>{this.state.totalLiabilities}</div>
              </div>
            </div>
          </div>
        </div>
        {/* TODO: remove */}
        <button onClick={() => {console.log(this.state)}}>Test</button>
      </div>
    )
  }
}
