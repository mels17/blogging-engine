class Utils {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

    urlForSlug(slug) {
      return this.baseURL + "posts/" + slug;
    }

    urlForAllPosts() {
      return this.baseURL + "posts/";

    }
}

module.exports = Utils;


// class outputSomethingToFile {
//   output(object) {
//     throw new Error('Need to implement')
//   }
// }
//
// class outputSomethingToFileCSV extends outputSomethingToFile{
//   output(object) {
//     return object.to_csv
//   }
// }
//
// class outputSomethingToFileJSON extends outputSomethingToFile {
//   output(object) {
//     return object.to_json
//   }
// }
//
// class outputSomethingToFileMock {
//   output(object) {
//     //
//   }
// }
//
// JSON
// CSV
//
//
//
//
// Thing {
//
//   constructor(outputSomethingToFile) {
//
//   this.outputSomethingToFile = outputSomethingToFile
//   }
//
//   output(someObject) {
//     this.outputSomethingToFile.output(someObject)
//     }
//
//     otherMeothofs(){
//
//     }
// }
//
//
//
// new Thing(outputSomethingToFile)
// new Thing(outputSomethingToFileCSV)
// new Thing(outputSomethingToFileJSON)
// new Thing(outputSomethingToFileMock)
