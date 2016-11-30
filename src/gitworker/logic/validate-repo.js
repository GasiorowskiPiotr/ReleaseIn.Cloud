"use strict";
var simpleGitFactory = require('simple-git');
var fs_1 = require('fs');
var rimraf = require('rimraf');
var validateRepo = function (gitUrl, resp) {
    fs_1.mkdtemp('git', function (err, dirName) {
        if (err) {
            resp(err);
            return;
        }
        var simpleGit = simpleGitFactory(dirName);
        simpleGit
            .clone(gitUrl, dirName)
            .branch(function (err, branchSummary) {
            if (err) {
                resp(err);
                return;
            }
            var branchNames = branchSummary.all.filter(function (branch) { return branch.indexOf('remotes/') === -1; });
            resp(null, { isOk: true, branches: branchNames });
            rimraf(dirName, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateRepo;
//# sourceMappingURL=validate-repo.js.map