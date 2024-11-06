function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const hasDisallowedFields = (requestBody, disallowedFields) => {
  const fieldChecks = [];
  for (const field of disallowedFields) {
    if (field in requestBody) {
      fieldChecks.push(field);
    }
  }
  return !!fieldChecks.length;
};

export { escapeRegex, hasDisallowedFields };
