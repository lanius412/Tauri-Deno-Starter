import React, { useState } from "https://esm.sh/react@18.2.0";
import { dialog, invoke } from "https://esm.sh/@tauri-apps/api@1.2.0";
import { tw } from 'https://cdn.skypack.dev/twind';


export default function App(){
    const [visible, toggleVisible] = useState(false);
    const logVisibleToggle = () => toggleVisible(!visible);

    const sleep = (m: number) => new Promise(_ => setTimeout(_, m))
    const [inprogress, startProgress] = useState(false);
    const run = async () => {
        if (filepath === '') {
            dialog.message('File not found.', { type: 'warning' });
            return
        }
        startProgress(true);

        printLog('Reading file...');
        await sleep(2000);
        let asins = new(Array<string>);
        await invoke('read_file', {path: filepath})
            .then(result => {
                if (typeof result === 'string') {
                    asins = result.split(',');
                } else {
                    dialog.message('Invalid file data', { type: 'error' });
                    return
                }
            })
            .catch(e => {
                dialog.message(`Error: ${e}`, { type: 'error' });
                return
            })
        
        const asin_nums = asins.length;
        printLog(`Found ${asin_nums} ASINs`);

        for await (const [idx, asin] of asins.entries()) {
            printLog(`${idx+1}/${asin_nums}: ${asin}`);
        }

        startProgress(false);
    }

    const [filepath, setSelectedFile] = useState('');
    function openFileDialog() {
        dialog.open({
            filters: [{
                name: 'Comma-Separated Values',
                extensions: ['csv']
            }]
        }).then(file => {
            if (file === null) return;
            setSelectedFile(file as string);
            printLog(`Selected File: ${file as string}`, true);
        });
    }

    function printLog(log_message: string, clear = false) {
        const textarea = document.getElementById('log') as HTMLTextAreaElement;
        if (clear) textarea.value = '';
        textarea.value += log_message + '\n';
    }


    return (
        <div>
            <div className={tw`flex mx-2 my-5`}>
                <input type="text" value={filepath} placeholder="No file chosen" onClick={openFileDialog} className={tw`block w-full text-lg text-white border-transparent rounded-lg cursor-pointer bg-gray-900 pl-2 focus:outline-none`}></input>
                <input type="button" value="+" onClick={openFileDialog} className={tw`flex-none text-lg text-white border-transparent rounded-lg cursor-pointer px-2 bg-gray-900`}></input>
            </div>

            <div className={tw`mx-2 my-5`}>
                <button type="button" onClick={logVisibleToggle} className={tw`flex justify-between w-1/12 text-white focus:outline-none focus:ring-0`}>
                    <span className={tw`pl-2`}>logs</span>
                    <svg className={visible ? tw`w-6 h-6` : tw`w-6 h-6 rotate-180`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
                <div className={visible ? tw`` : tw`hidden`}>
                    <textarea id="log" className={tw`w-full text-white font-medium rounded-lg  outline-none overflow-y-auto bg-gray-700 pl-2`} readOnly></textarea>
                </div>
            </div>

            <div className={tw`mx-2 mb-2`}>
                <input type="button" value="Start !" className={inprogress ? tw`w-full text-lg text-gray-700 border-transparent rounded-lg bg-gray-900` : tw`w-full text-lg text-white border-transparent rounded-lg cursor-pointer bg-gray-900`} onClick={run} disabled={inprogress}></input>
            </div>
        </div>
    )
}
