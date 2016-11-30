const simpleGitFactory = require('simple-git');
import { mkdtemp, rmdir } from 'fs';
import * as guid from 'uuid'
import * as rimraf from 'rimraf';



const validateRepo = (gitUrl, resp: (err: Error, resp?: { isOk: boolean, branches: string[] } ) => void) => {

    mkdtemp('git', (err, dirName) => {
        if(err) {
            resp(err);
            return;
        }

        const simpleGit = simpleGitFactory(dirName);

        simpleGit
            .clone(gitUrl, dirName)
            .branch((err, branchSummary) => {

                if(err) {
                    resp(err);
                    return;
                }

                const branchNames = branchSummary.all.filter(branch => branch.indexOf('remotes/') === -1);
                resp(null, { isOk: true, branches: branchNames });

                rimraf(dirName, (err) => {
                    if(err) {
                        console.log(err);
                    }
                });
            });
    })

};

export default validateRepo; 