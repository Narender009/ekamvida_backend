// app.get('/api/testimonials', async (req, res) => {
//     try {
//       const testimonials = await Testimonial.find();
//       res.json(testimonials);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching testimonials', error });
//     }
//   });

  
//   app.post('/api/testimonials', async (req, res) => {
//     try {
//       const { name, message } = req.body;
  
//       const newTestimonial = new Testimonial({
//         name,
//         message,
//       });
  
//       const savedTestimonial = await newTestimonial.save();
//       res.status(201).json(savedTestimonial);
//     } catch (error) {
//       res.status(400).json({ message: 'Error adding testimonial', error });
//     }
//   });

  
//   app.delete('/api/testimonials/:id', async (req, res) => {
//     try {
//       const { id } = req.params;
//       await Testimonial.findByIdAndDelete(id);
//       res.status(200).json({ message: 'Testimonial deleted successfully' });
//     } catch (error) {
//       res.status(400).json({ message: 'Error deleting testimonial', error });
//     }
//   });

