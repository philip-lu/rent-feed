import React from "react";
import "./Feed.css"

export default class FetchAdds extends React.Component {
    state = {
        loading: true,
        adds: null,
    }

    // Static fetch
   /*  async componentDidMount() {
        const url = "https://dimdim.wrenchtech.io/api/search/9498dc25-3472-4e20-83a9-1d6403dc39e3/list/?offset=0&limit=21&ordering=date";
        const response = await fetch(url, {
            headers: {
                "Accept-Language": "ru"
            }
        });
        const data = await response.json();
        this.setState({ adds: data.results, loading: false});
    } */

    // ----- Fetch interval------ //
    intervalID;

    componentDidMount() {
        this.loadData()
        this.intervalID = setInterval(this.loadData.bind(this), 600000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
      }

      refresh = () => {
        this.setState({
            adds: null,
        });
        this.loadData();
      }

    async loadData() {
        try {
            // New buildings - 5500/8000
            // const url = "https://dimdim.wrenchtech.io/api/search/9498dc25-3472-4e20-83a9-1d6403dc39e3/list/?offset=0&limit=21&ordering=date";

            // All regions/owners - 5500/8000
            // const url = "https://dimdim.wrenchtech.io/api/search/8cf3d524-46dd-4dcc-9c55-c1ecfd18d698/list/?offset=0&limit=21&ordering=date";

            // New buildings/owners - 5000/7500
            //const url = "https://dimdim.wrenchtech.io/api/search/ab267fec-38f5-41a3-bcbb-b4761a193a06/list/?offset=0&limit=21&ordering=date";
            
            // Green&Red subway/owners - 6000/8000
            const url = "https://dimdim.wrenchtech.io/api/search/f098fe64-edf0-41dd-9101-a550980f2bd8/list/?offset=0&limit=21&ordering=date";
            
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
                <button className="get-button" onClick={this.refresh}>Refresh</button>
                {this.state.loading || !this.state.adds ? ( <div className="whiteScreen"></div> ) : ( 
                   <div>
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
                           <p className="price"><span className="price-uah"><strong>{apartment.price_uah} грн.</strong></span><span className="price-usd"> / {apartment.price_usd} usd</span></p>
                           <p>этаж {apartment.floor} из {apartment.floors_total}</p>
                           <p className="description">{apartment.description}</p>
                           <a target="_blank" rel="noreferrer" href={apartment.providers[0].url}>{apartment.providers[0].provider}</a>
                       </div>
                   ))}
               </div> 
                )}
            </div>
        )
    }
}