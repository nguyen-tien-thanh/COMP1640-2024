module.exports = {
  isIncluded: function (arr, check) {
    return arr.some((a) => a._id.equals(check));
  },
  jsonParse: function (data) {
    return JSON.stringify(data);
  },
  handleGender: function (gender) {
    switch (gender) {
      case 1:
        return "Male";
      case 0:
        return "Female";
      default:
        return null;
    }
  },
  ifNotEqDate: function (date1, date2, options) {
    if (new Date(date1).getTime() !== new Date(date2).getTime()) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  canCommentExpired: function (closureDate, role) {
    let timeLeft = new Date(closureDate) - new Date();

    if (role === "Marketing Coordinator") {
      const fourteenDaysInMilliseconds = 14 * 24 * 60 * 60 * 1000;
      if (timeLeft <= 0 && timeLeft > -fourteenDaysInMilliseconds) {
        return true;
      }
    }
    return timeLeft > 0;
  },
  eachUpTo: function (array, count, options) {
    var result = "";
    for (var i = 0; i < count && i < array.length; i++) {
      result += options.fn(array[i]);
    }
    return result;
  },
  canEditComment: function (canContribute, userId, ownerId, roleName) {
    if (
      canContribute &&
      (userId.equals(ownerId) || roleName === "Marketing Coordinator")
    ) {
      return true;
    } else {
      return false;
    }
  },
  canSeeFaculties: function (faculties, currentUser) {
    if (currentUser && currentUser.role.name === "Administrator") {
      return faculties;
    }
    const result = faculties.filter((fal) => {
      return fal.users.some((u) => {
        return u._id.equals(currentUser._id);
      });
    });
    return result;
  },
  count: function (arr) {
    return arr.length;
  },
  isImage: function (fileName) {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const extension = fileName
      .substring(fileName.lastIndexOf("."))
      .toLowerCase();
    return imageExtensions.includes(extension);
  },
  isDocument: function (fileName) {
    const documentExtensions = [".doc", ".docx"];
    const extension = fileName
      .substring(fileName.lastIndexOf("."))
      .toLowerCase();
    return documentExtensions.includes(extension);
  },
  checkExpired: function (targetDate) {
    const targetTime = new Date(targetDate).getTime();

    const currentTime = new Date().getTime();

    const remainingTime = targetTime - currentTime;

    if (remainingTime <= 0) {
      return true;
    } else {
      return false;
    }
  },
  calculateRemainingTime: function (targetDate, role) {
    const targetTime = new Date(targetDate).getTime();

    const currentTime = new Date().getTime();

    var remainingTime = targetTime - currentTime;

    if (role === "Marketing Coordinator" && remainingTime <= 0) {
      remainingTime += 14 * 24 * 60 * 60 * 1000;
    }

    if (remainingTime <= 0) {
      return "Expired";
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );

    let formattedString = "";
    if (days > 0) {
      formattedString += days + " days ";
    }
    if (hours > 0) {
      formattedString += hours + " hours ";
    }
    if (minutes > 0) {
      formattedString += minutes + " minutes ";
    }

    return formattedString + "left";
  },
  formatDateTime: function formatDate(dateString, option) {
    const date = new Date(dateString);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);

    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
    };

    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    if (option === "date") {
      return formattedDate;
    } else if (option === "time") {
      return formattedTime;
    } else return `${formattedDate} - ${formattedTime}`;
  },
  ifeq: function (a, b, options) {
    if (a == b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  ifNotEq: function (a, b, options) {
    if (a != b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
};
