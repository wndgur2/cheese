import axios from "axios";

class Branch{
    constructor(id, name, longitude, latitude, shooting_cost, printing_cost, paper_amount){
        this.id = id;
        this.name = name;
        this.longitude = longitude;
        this.latitude = latitude;
        this.shooting_cost = shooting_cost;
        this.printing_cost = printing_cost;
        this.paper_amount = paper_amount;
    }

    async getAddress(){
        try{
            const res = await axios.get('/api/getAddress',{
                params:{
                    request:"coordsToaddr",
                    coords:`${this.longitude},${this.latitude}`,
                    sourcecrs:"epsg:4326",
                    output:"json",
                    orders:"legalcode"
                }
            })

            let address = [];
            for(let r in res.data.results[0].region)
            address.push(res.data.results[0].region[r].name);
            this.address = address.splice(1,).join(' ');

        } catch(error){
            console.log(error);
            throw new Error('Failed to fetch data');
        }
    }
}

export default Branch;