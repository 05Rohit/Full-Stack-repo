

console.log("hello")


// function fetchDataAndSaveToMongo() {
//     return axios
//       .get(
//         "https://tataelxsi.atlassian.net/rest/api/3/search?jql=created>=-180d%20AND%20project%20IN%20(FSG,MPOC,FALUDAY,MFC,MQA,MFL,FALSKY,FALNOS)%20ORDER%20BY%20created%20DESC&maxResults=250",
//         { auth }
//       )
//       .then((response) => {


//         const data = response.data["issues"];
//         const data2 = response.data;
//         const processedData = data.map((issueData) => {
//           const priorityName = issueData.fields.priority.name;
//           const urgencyName = issueData.fields.priority.name;
//           const impactName = issueData.fields.priority.name;
//           const key = issueData.key;
//           const createdBy = [
//             {
//               email: issueData.fields.reporter.emailAddress,
//               employeeNum: issueData.fields.reporter.emailAddress,
//               name: issueData.fields.reporter.displayName,
//             },
//           ];
//           const assignedTo = [
//             {
//               name: issueData.fields.assignee.displayName,
//               employeeNum: issueData.fields.assignee.emailAddress,
//             },
//           ];
//           const eventTypeName = issueData.fields.issuetype.name;
//           const createdAt = issueData.fields.created;
//           const actStartDate = issueData.fields.updated;
//           const completedAt = issueData.fields.resolutiondate;
//           const duration = issueData.fields.timespent;
//           const status = issueData.fields.status.name;
//           const projectName = issueData.fields.project.key;
//           const reason = issueData.fields.summary;
//           const source = "jira";
//           return {
//             status,
//             key,
//             projectName,
//             eventTypeName,
//             priorityName,
//             urgencyName,
//             impactName,
//             createdBy,
//             assignedTo,
//             duration,
//             source,
//             reason,
//             actStartDate,
//             completedAt,
//             createdAt,
//           };
//         });
//         saveDataToMongoDB(processedData);
//         return data2;



//       })
//       .catch((error) => {
//         // console.log(error);
//         throw error;
//       });
//   }