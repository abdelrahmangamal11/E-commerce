class apifeatures {
  constructor(buildquery, querystring) {
    this.buildquery = buildquery;
    this.querystring = querystring;
  }

  filter() {
    const queryObject = {
      ...this.querystring,
    }; /*to copy the querystring and put it into queryObject*/
    const deletedQuery = ["p", "limit", "sort", "fields", "keyword"];
    deletedQuery.forEach((delet) => {
      delete queryObject[delet];
    });
    let querystring = JSON.stringify(queryObject);
    querystring = querystring.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (resault) => `$${resault}`
    );
    this.buildquery = this.buildquery.find(JSON.parse(querystring));
    return this;
  }

  sort() {
    if (this.querystring.sort) {
      console.log(this.querystring.sort);
      const sortby = this.querystring.sort.split(",").join(" ");

      this.buildquery = this.buildquery.sort(sortby);
    } else {
      this.buildquery = this.buildquery.sort("createdAt");
    }

    return this;
  }

  field() {
    if (this.querystring.fields) {
      const fields = this.querystring.sort.split(",").join(" ");
      this.buildquery = this.buildquery.select(fields);
    } else {
      this.buildquery = this.buildquery.select("-__v");
      return this;
    }
  }

  search(modelName) {
    if (this.querystring.keyword) {
      let query = {};
      if (modelName.includes("Products")) {
        query.$or = [
          { title: { $regex: this.querystring.keyword, $options: "i" } },
          { description: { $regex: this.querystring.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.querystring.keyword, $options: "i" } };
      }

      this.buildquery = this.buildquery.find(query);
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.querystring.p * 1 || 1; /*http://localhost:8000/?p=value*/
    const limit = this.querystring.limit * 1 || 10;
    this.buildquery = this.buildquery.skip(limit * (page - 1)).limit(limit);
    const endindex = page * limit;
    const pagination = {};
    pagination.currentpage = page;
    pagination.limitpage = limit;
    pagination.pagesnumber = Math.ceil(countDocuments / limit);
    if (endindex < countDocuments) {
      pagination.next = page + 1;
    }
    if (limit * (page - 1) > 0) {
      /*limit * (page - 1) ==>skip*/
      pagination.previous = page - 1;
    }
    this.paginationResault = pagination;
    return this;
  }
}
module.exports = apifeatures;
