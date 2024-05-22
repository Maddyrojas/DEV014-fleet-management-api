import { Handler } from "express";
import { getTaxiLocations, getLastTaxiLocations } from "../services/trajectoriesService";


export const getTrajectoriesByIdDate: Handler = async (req, res) => {
    try {
        const id = +(req.query.taxiId as string);
        const dateStr = req.query.date as string;
        if (!id || !dateStr) {
            return res.status(400).json({ message: 'Los parámetros taxiId y date son obligatorios en la consulta' });
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {// Validar que la fecha es válida
            return res.status(400).json({ message: 'El formato de la fecha es inválido' });
        }
        console.log(`Fecha recibida: ${date.toISOString()}`);
        const taxiLocation = await getTaxiLocations(id, date);
        return res.status(200).json(taxiLocation);
        //return 400 que pagina y limit no sean negativas. https://www.restapitutorial.com/httpstatuscodes.html
        //return res.status(401).json({ message: "if there is no authentication header" });
        //return res.status(403).json({ message: "if the authentication token is not from an admin user" });
        //return res.status(404).json({ message: "No se encontraron usuarios" }); if (taxis.length === 0) 
    } catch (error) {
        return res.status(500).json({message: 'Error en el servidor', error});
    }
}


export const lastTrajectory: Handler = async (req, res) =>{
    // muestra las ultimas localizaciones de todos los taxis
    /*{
        "taxiId": 7249,
        "plate": "CNCJ-2997",
        "date": "2008-02-08 17:36:33",
        "latitude": 116.291,
        "longitude": 39.88672
      },*/
    try {
        const { date } = req.query;
        const { id } = req.params;
        const endDate = new Date(date as string);
        endDate.setDate(endDate.getDate() + 1);
        const trajectory = await getLastTaxiLocations(id, endDate);
        if (!trajectory){
            return res.status(404).json({message: 'no se encontró ninguna trayectoria con el id proporcionado ' });
        }else{
            return res.status(200).json(trajectory);
        }
        //return res.status(401).json({ message: "if there is no authentication header" });
        //return res.status(403).json({ message: "if the authentication token is not from an admin user" });
        //return res.status(404).json({ message: "No se encontraron usuarios" }); if (taxis.length === 0) 
    } catch (error) {
        return res.status(500).json({error: 'Error al obtener la ultima ubicacion de los taxis'});
    }
}
