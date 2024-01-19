
const signoutfromalldevice = async (req, resp) => {

    await resp.clearCookie('cook');
    req.user.tokens = [];
    await req.user.save();
    resp.send('successfully signout from all devices..');
    resp.redirect('/signin');
    console.log('signoutfromalldevice')
}

const signout = async (req, resp) => {
    try {
        req.user.tokens = req.user.tokens.filter((e, i) => {
            return req.TOKEN !== e.token;
        })

        await resp.clearCookie('cook');
        req.user.save();
        resp.json("signout successfully..")

    } catch (error) {
        resp.status(500).send(error);

    }
}

module.exports = {signoutfromalldevice,signout}

