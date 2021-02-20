import * as fs from 'fs/promises';
import { handleError } from './handlerror.js';

export async function getJsonData(path) {

    try {
        const jsonData = await fs.readFile(path).then(data => data.toString());
        const data = JSON.parse(jsonData);
        return data;
    } catch (e) {
        handleError(e);
    }
}

export async function rewriteJsonData(path, dataObj) {
    
    const dataJson = JSON.stringify(dataObj, null, 2);

    try { 
        await fs.writeFile(path, dataJson);
        return true;
    }catch(e) {
        handleError(e);
    }
}
