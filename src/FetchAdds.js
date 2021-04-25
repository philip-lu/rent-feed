import React from "react";
import "./Feed.css"

export default class FetchAdds extends React.Component {
    state = {
        loading: true,
        adds: null,
    }

    // Static fetch
   /* async componentDidMount() {
        const url = "https://dimdim.wrenchtech.io/api/search/9498dc25-3472-4e20-83a9-1d6403dc39e3/list/?offset=0&limit=21&ordering=date";
        const response = await fetch(url, {
            headers: {
                "Accept-Language": "ru"
            }
        });
        const data = await response.json();
        this.setState({ adds: data.results, loading: false});
    } */

    componentDidMount() {
        this.loadData()
        this.interval = setInterval(this.loadData, 600000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
      }

    async loadData() {
        try {
            const url = "https://dimdim.wrenchtech.io/api/search/9498dc25-3472-4e20-83a9-1d6403dc39e3/list/?offset=0&limit=21&ordering=date";
            const response = await fetch(url, {
                headers: {
                        "Accept-Language": "ru"
                    }
            });
            const data = await response.json();
            this.setState({ 
                adds: data.results, 
                loading: false
            });
        } catch (e) {
            console.log(e);
        }
    }
  
    render(){
        const formateDate = (string) => {
            var options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
            return new Date(string).toLocaleDateString("ru-RU", options);
        };

        return (
            <div>
                {this.state.loading || !this.state.adds ? ( <h3>Ща всё буит...</h3> ) : ( 
                   <div>
                   <button className="get-button" onClick={this.loadData}>Обновить</button>
                   {this.state.adds.map(apartment => (
                       <div className="apartment-card" key={apartment.id}>
                            <div className="topItems">
                                <a target="_blank" rel="noreferrer" className="mapsLink" href={"https://www.google.com/maps/search/?api=1&query=" + apartment.street + "," + apartment.building_no }>
                                    <p className={apartment.is_owner === true ? "owner" : "address" } key={apartment.id}>
                                        {apartment.street}, {apartment.building_no}
                                        <span className="owner" style={{ display: apartment.is_owner === true ? "" : "none" }}> (от владельца)</span>
                                    </p>
                                </a>
                                <p className="date-time"> {
                                        formateDate(apartment.providers[0].created_at)
                                    }
                                </p>
                            </div>
                           <p className="price"><span className="price-uah">{apartment.price_uah} грн.</span><span className="price-usd"> / {apartment.price_usd} usd</span></p>
                           <div className="apartment-card-images">
                                {apartment.images.map(i => (
                                    <img className="apartment-card-images-item" src={i} key={i} alt={i}/>
                                ))}
                           </div>
                           <p>этаж {apartment.floor} из {apartment.floors_total}</p>
                           <p className="description">{apartment.description}</p>
                           <a target="_blank" rel="noreferrer" href={apartment.providers[0].url}>{apartment.providers[0].url}</a>
                       </div>
                   ))}
               </div> 
                )}
            </div>
        )
    }
}