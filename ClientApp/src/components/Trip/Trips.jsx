import React, {Component} from 'react';
import axios from 'axios';

export class Trips extends Component
{
    constructor(props)
    {
        super(props);

        this.onTripUpdate = this.onTripUpdate.bind(this);
        this.onTripDelete = this.onTripDelete.bind(this);

        this.state = {
            trips: [],
            loading: true,
            failed: false,
            error: ''
        }
    }

    componentDidMount(){
        this.populateTripsData();
    }

    onTripDelete(id){
        const {history} = this.props;
        history.push('/delete/' + id);
    }

    onTripUpdate(id){
        const {history} = this.props;
        history.push('/update/' + id);
    }

    populateTripsData(){
        axios.get("api/Trips/GetTrips").then(result => {
            const response = result.data;
            this.setState({trips: response, loading: false, failed: false, error: ""})
        }).catch(error => {
            this.setState({trips: [], loading: false, failed: true, error: "Trips could not be loaded"});
        });
    }

    renderAllTripsTable(trips){
        return (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Date started</th>
                        <th>Date completed</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        trips.map(trip => (
                        <tr key={trip.id}>
                            <td>{trip.name}</td>
                            <td>{trip.description}</td>
                            <td>{new Date(trip.dateStarted).toLocaleDateString()}</td>
                            <td>{trip.dateCompleted ? new Date(trip.dateCompleted).toLocaleDateString() : '-'}</td>
                            <td>
                                <div className="form-group">
                                    <button className="btn btn-success" onClick={() => this.onTripUpdate(trip.id)}>Update</button>
                                    <button className="btn btn-danger" onClick={() => this.onTripDelete(trip.id)}>Delete</button>
                                </div>
                            </td>
                        </tr>  
                        ))
                    }
                </tbody>
            </table>
        )
    }

    render(){
        let content = this.state.loading ? (
            <p>
                <em>Loading...</em>
            </p>
        ) : ( this.state.failed ? (
            <div className="text-danger">
                <em>{this.state.error}</em>
            </div>
        ) : (this.renderAllTripsTable(this.state.trips))
            
        )

        return (
            <div>
                <h1>All trips</h1>
                <p>Here you can see all trips</p>
                {content}
            </div>
        );
    }
}