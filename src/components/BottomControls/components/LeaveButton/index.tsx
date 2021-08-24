import OtherControl from "../OtherControl";

function LeaveButton () {

  function handleClick () {
    window.location.replace("/thank-you");
  }

  return (
    <OtherControl
      iconName="Vlt-icon-phone-down-full"
      iconColor="red"
      title="Leave Meeting"
      onClick={handleClick}
    />
  )
}

export default LeaveButton;
