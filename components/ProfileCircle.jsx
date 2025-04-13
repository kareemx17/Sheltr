const ProfileCircle = ({user}) => {
    return ( 
        <div className="w-10 h-10 rounded-full bg-[#93AEC5] flex items-center justify-center">
            {user.name[0]}
        </div>
    );
}
 
export default ProfileCircle;