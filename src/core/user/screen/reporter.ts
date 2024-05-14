const RNFS = require('react-native-fs');
import XLSX from 'xlsx';
import { notificationRoutes } from '../../notification/api-route';
import axios from 'axios';

export default class ReportExporter {

    async exportDataToExcel(bearerToken: string, childId: string | number) {

        const response = await axios({
            url: notificationRoutes.getAllNotification.route(0, 20),
            method: notificationRoutes.getAllNotification.method,
            headers: {
                Authorization: 'Bearer ' + bearerToken,
            },
        });

        console.log('response', response.data.data.rows);
        const formattedData = response?.data?.data?.rows?.map((row: any) => {
            if (row?.assigner.email === childId && row.projectmodule === 'location') {
                const body = {
                    time: new Date(row.created.at).toLocaleString(),
                    message: row.note
                }
                return body;
            }
        })

        console.log('formattedData', formattedData);


        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(formattedData)
        XLSX.utils.book_append_sheet(wb, ws, "Users")
        const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

        // Write generated excel to Storage
        RNFS.writeFile('/storage/emulated/0/Download' + `/${childId}.xlsx`, wbout, 'ascii').then((r: any) => {
            console.log('Success');
        }).catch((e: any) => {
            console.log('Error', e);
        });

    }
}
