exports.getAdminClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('currentMembers', 'name email');

    res.status(200).json({
      success: true,
      count: classes.length,
      classes: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};