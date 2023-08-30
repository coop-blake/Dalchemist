
import detectPort from 'detect-port';



const port = parseInt(process.env.PORT || '4848');

detectPort(port, (err: Error, availablePort: number) => {
  if (port !== availablePort) {
    throw new Error(
        `Port "${port}" on "localhost" is already in use. Please use another port. ex: PORT=4343 npm start`
    );
  } else {
    process.exit(0);
  }
});
